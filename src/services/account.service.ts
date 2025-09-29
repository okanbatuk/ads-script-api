import { inject, injectable } from "inversify";
import { startOfDay, subDays } from "date-fns";
import {
  type Account,
  type AccountScore,
  AccountStatus,
  Prisma,
  PrismaClient,
} from "../models/prisma.js";
import { TYPES } from "../types/index.js";
import {
  AccountMapper,
  AccountScoreMapper,
  CampaignMapper,
} from "../mappers/index.js";

import type { AccountUpsertSchema } from "../schemas/index.js";
import type { IAccountService } from "../interfaces/index.js";
import type {
  AccountDto,
  AccountScoreDto,
  CampaignDto,
} from "../dtos/index.js";

@injectable()
export class AccountService implements IAccountService {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient,
  ) {}

  transform = (row: AccountUpsertSchema): Account => {
    const entries = Object.entries(row).map(([key, value]) => {
      if (key === "status") {
        const upper = (value as string).toUpperCase();
        return Object.values(AccountStatus).includes(upper as AccountStatus)
          ? [key, upper as AccountStatus]
          : [key, AccountStatus.UNKNOWN];
      }
      return [key, value];
    });
    return Object.fromEntries(entries);
  };

  async getAll(
    include: boolean = false,
  ): Promise<{ accounts: AccountDto[]; total: number }> {
    const [rows, total] = await Promise.all([
      include
        ? this.prisma.account.findMany({
            orderBy: { id: "asc" },
            include: { scores: true },
          })
        : this.prisma.account.findMany({ orderBy: { id: "asc" } }),
      this.prisma.account.count(),
    ]);
    return { accounts: AccountMapper.toDtos(rows), total };
  }

  async getCampaigns(
    accountId: number,
  ): Promise<{ campaigns: CampaignDto[]; total: number }> {
    const [rows, total] = await Promise.all([
      this.prisma.campaign.findMany({
        where: { accountId },
        orderBy: { name: "asc" },
      }),
      this.prisma.campaign.count({
        where: { accountId },
      }),
    ]);
    return { campaigns: rows.map((r) => CampaignMapper.toDto(r)), total };
  }

  async getAccountScores(
    accountId: number,
    days: number = 7,
  ): Promise<{ scores: AccountScoreDto[]; total: number }> {
    const where: Prisma.AccountScoreWhereInput = {
      accountId,
      date: { gte: startOfDay(subDays(new Date(), days)) },
    };

    const [rows, total] = await Promise.all([
      this.prisma.accountScore.findMany({ where, orderBy: { date: "desc" } }),
      this.prisma.accountScore.count({ where }),
    ]);

    return { scores: AccountScoreMapper.toDtos(rows), total };
  }

  async getBulkAccountScores(
    accountIds: number[],
    days: number = 7,
  ): Promise<{ scores: AccountScoreDto[]; total: number }> {
    const where: Prisma.AccountScoreWhereInput = {
      accountId: { in: accountIds },
      date: { gte: startOfDay(subDays(new Date(), days)) },
    };

    const [rows, total] = await Promise.all([
      this.prisma.accountScore.findMany({ where, orderBy: { date: "desc" } }),
      this.prisma.accountScore.count({ where }),
    ]);

    return { scores: AccountScoreMapper.toDtos(rows), total };
  }

  async getById(accountId: number): Promise<AccountDto | null> {
    const raw = await this.prisma.account.findUnique({
      where: { id: accountId },
    });
    return raw ? AccountMapper.toDto(raw) : null;
  }

  async getByAccountId(accountId: string): Promise<AccountDto | null> {
    const row = await this.prisma.account.findUnique({
      where: { accountId },
    });
    return row ? AccountMapper.toDto(row) : null;
  }

  async upsert(items: AccountUpsertSchema[]): Promise<void> {
    const data = items.map((i) => this.transform(i));

    await this.prisma.$transaction(async (tx) => {
      for (const row of data) {
        await tx.account.upsert({
          where: { accountId: row.accountId },
          update: { name: row.name, status: row.status },
          create: row,
        });
      }
    });
  }

  async setAccountScores(accountIds: number[], date: Date): Promise<void> {
    const rows = await this.prisma.campaign.findMany({
      where: { id: { in: accountIds } },
      include: {
        scores: {
          where: { date },
          select: { qs: true },
        },
      },
    });

    const map = new Map<number, { qsSum: number; count: number }>();

    for (let c of rows) {
      if (c.scores.length === 0) continue;
      const key = c.accountId;
      const curr = map.get(key) ?? { qsSum: 0, count: 0 };
      for (let sc of c.scores) {
        curr.qsSum += sc.qs;
        curr.count += 1;
      }
      map.set(key, curr);
    }

    const data: Omit<AccountScore, "id">[] = Array.from(map.entries()).map(
      ([accountId, v]) => ({
        accountId,
        date,
        qs: v.count ? v.qsSum / v.count : 0,
        campaignCount: v.count,
      }),
    );

    if (data.length) {
      const accountIds = data.map((d) => d.accountId);
      const dates = data.map((d) => d.date);
      const qsArr = data.map((d) => d.qs);
      const counts = data.map((d) => d.campaignCount);

      await this.prisma.$executeRaw`
        INSERT INTO account_score (account_id, date, qs, campaign_count)
        SELECT t.account_id, t.date, t.qs, t.campaign_count
        FROM UNNEST(
          ${accountIds}::number[],
          ${dates}::date[],
          ${qsArr}::float[],
          ${counts}::int[]
        ) AS t(account_id, date, qs, campaign_count)
        ON CONFLICT (account_id, date)
        DO UPDATE SET
          qs = EXCLUDED.qs,
          campaign_count = EXCLUDED.campaign_count`;
    }
  }
}
