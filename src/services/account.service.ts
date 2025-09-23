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
import { AccountMapper, AccountScoreMapper } from "../mappers/index.js";

import type { AccountUpsertDto } from "../schemas/index.js";
import type { IAccountService } from "../interfaces/index.js";
import type { AccountDto, AccountScoreDto } from "../dtos/index.js";

@injectable()
export class AccountService implements IAccountService {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient,
  ) {}

  transform = (row: AccountUpsertDto): Account => {
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

  async getAccountScores(
    accountId: bigint,
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
    accountIds: bigint[],
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

  async getById(accountId: bigint): Promise<AccountDto | null> {
    const raw = await this.prisma.account.findUnique({
      where: { id: accountId },
    });
    return raw ? AccountMapper.toDto(raw) : null;
  }

  async upsert(items: AccountUpsertDto[]): Promise<void> {
    const data = items.map((i) => this.transform(i));

    await this.prisma.$transaction(async (tx) => {
      for (const row of data) {
        await tx.account.upsert({
          where: { id: row.id },
          update: { name: row.name, status: row.status },
          create: row,
        });
      }
    });
  }

  async setAccountScores(accountIds: bigint[], date: Date): Promise<void> {
    const rows = await this.prisma.campaign.findMany({
      where: { accountId: { in: accountIds } },
      include: {
        scores: {
          where: { date },
          select: { qs: true },
        },
      },
    });

    const map = new Map<bigint, { qsSum: number; count: number }>();

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
          ${accountIds}::bigint[],
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
