import { inject, injectable } from "inversify";
import { startOfDay, subDays } from "date-fns";
import { TYPES } from "../types/index.js";
import {
  type AdGroup,
  type AdGroupScore,
  Prisma,
  PrismaClient,
  Status,
} from "../models/prisma.js";
import { AdGroupMapper, AdGroupScoreMapper } from "../mappers/index.js";

import type { IAdGroupService } from "../interfaces/index.js";
import type { AdGroupDto, AdGroupScoreDto } from "../dtos/index.js";
import type { AdGroupUpsertSchema } from "../schemas/index.js";

@injectable()
export class AdGroupService implements IAdGroupService {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient,
  ) {}

  transform = (row: AdGroupUpsertSchema): AdGroup => {
    const entries = Object.entries(row).map(([key, value]) => {
      if (key === "status") {
        const upper = (value as string).toUpperCase();
        return Object.values(Status).includes(upper as Status)
          ? [key, upper as Status]
          : [key, Status.UNKNOWN];
      }
      return [key, value];
    });
    return Object.fromEntries(entries);
  };

  async getAdGroupScores(
    adGroupId: bigint,
    days: number = 7,
  ): Promise<{ scores: AdGroupScoreDto[]; total: number }> {
    const where: Prisma.AdGroupScoreWhereInput = {
      adGroupId,
      date: { gte: startOfDay(subDays(new Date(), days)) },
    };

    const [rows, total] = await Promise.all([
      this.prisma.adGroupScore.findMany({ where, orderBy: { date: "desc" } }),
      this.prisma.adGroupScore.count({ where }),
    ]);

    return { scores: AdGroupScoreMapper.toDtos(rows), total };
  }

  async getBulkAdGroupScores(
    adGroupIds: bigint[],
    days: number = 7,
  ): Promise<{ scores: AdGroupScoreDto[]; total: number }> {
    const where: Prisma.AdGroupScoreWhereInput = {
      adGroupId: { in: adGroupIds },
      date: { gte: startOfDay(subDays(new Date(), days)) },
    };
    const [rows, total] = await Promise.all([
      this.prisma.adGroupScore.findMany({ where, orderBy: { date: "desc" } }),
      this.prisma.adGroupScore.count({ where }),
    ]);
    return { scores: AdGroupScoreMapper.toDtos(rows), total };
  }

  async getById(adGroupId: bigint): Promise<AdGroupDto | null> {
    const raw = await this.prisma.adGroup.findUnique({
      where: { id: adGroupId },
    });
    return raw ? AdGroupMapper.toDto(raw) : null;
  }

  async upsert(items: AdGroupUpsertSchema[]): Promise<void> {
    const data = items.map((i) => this.transform(i));

    await this.prisma.$transaction(async (tx) => {
      for (const row of data) {
        await tx.adGroup.upsert({
          where: { id: row.id },
          update: {
            name: row.name,
            status: row.status,
          },
          create: row,
        });
      }
    });
  }

  async setAdGroupScores(adGroupIds: bigint[], date: Date): Promise<void> {
    const rows = await this.prisma.keyword.findMany({
      where: { adGroupId: { in: adGroupIds } },
      include: {
        scores: {
          where: { date },
          select: { qs: true },
        },
      },
    });

    const map = new Map<bigint, { qsSum: number; count: number }>();

    for (let kw of rows) {
      if (kw.scores.length === 0) continue;
      const key = kw.adGroupId;
      const curr = map.get(key) ?? { qsSum: 0, count: 0 };
      for (let sc of kw.scores) {
        curr.qsSum += sc.qs;
        curr.count += 1;
      }
      map.set(key, curr);
    }

    const data: Omit<AdGroupScore, "id">[] = Array.from(map.entries()).map(
      ([adGroupId, v]) => ({
        adGroupId,
        date,
        qs: v.count ? v.qsSum / v.count : 0,
        keywordCount: v.count,
      }),
    );

    if (data.length) {
      const adGroupIds = data.map((d) => d.adGroupId);
      const dates = data.map((d) => d.date);
      const qsArr = data.map((d) => d.qs);
      const counts = data.map((d) => d.keywordCount);

      await this.prisma.$executeRaw`
        INSERT INTO ad_group_score (ad_group_id, date, qs, keyword_count)
        SELECT * FROM UNNEST(
          ${adGroupIds}::bigint[],
          ${dates}::date[],
          ${qsArr}::float[],
          ${counts}::int[]
        ) AS t(ad_group_id, date, qs, keyword_count)
        ON CONFLICT (ad_group_id, date)
        DO UPDATE SET
          qs = EXCLUDED.qs,
          keyword_count = EXCLUDED.keyword_count`;
    }
  }
}
