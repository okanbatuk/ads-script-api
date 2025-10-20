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
import {
  AdGroupMapper,
  AdGroupScoreMapper,
  KeywordMapper,
} from "../mappers/index.js";

import type { IAdGroupService } from "../interfaces/index.js";
import type { AdGroupDto, AdGroupScoreDto, KeywordDto } from "../dtos/index.js";
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

  async getAllKeywords(
    adGroupId: bigint,
    include: boolean = false,
  ): Promise<{ keywords: KeywordDto[]; total: number }> {
    const where: Prisma.KeywordWhereInput = {
      adGroupId,
    };
    const [rows, total] = await Promise.all([
      include
        ? this.prisma.keyword.findMany({
            where,
            include: { scores: true },
            orderBy: { keyword: "asc" },
          })
        : this.prisma.keyword.findMany({ where, orderBy: { keyword: "asc" } }),
      this.prisma.keyword.count({ where }),
    ]);
    return { keywords: rows.map((r) => KeywordMapper.toDto(r)), total };
  }

  async getAdGroupScores(
    adGroupId: bigint,
    days: number = 7,
  ): Promise<{ scores: AdGroupScoreDto[] }> {
    const where: Prisma.AdGroupScoreWhereInput = {
      adGroupId,
      date: { gte: startOfDay(subDays(new Date(), days)) },
    };
    const rows = await this.prisma.adGroupScore.findMany({
      where,
      orderBy: { date: "desc" },
    });

    return { scores: AdGroupScoreMapper.toDtos(rows) };
  }

  async getBulkAdGroupScores(
    adGroupIds: bigint[],
    days: number = 7,
  ): Promise<{ scores: AdGroupScoreDto[] }> {
    const where: Prisma.AdGroupScoreWhereInput = {
      adGroupId: { in: adGroupIds },
      date: { gte: startOfDay(subDays(new Date(), days)) },
    };
    const rows = await this.prisma.adGroupScore.findMany({
      where,
      orderBy: { date: "desc" },
    });
    return { scores: AdGroupScoreMapper.toDtos(rows) };
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
        INSERT INTO "AdGroupScore" ("adGroupId", "date", "qs", "keywordCount")
        SELECT *
        FROM UNNEST(
          ${adGroupIds}::bigint[],
          ${dates}::date[],
          ${qsArr}::double precision[],
          ${counts}::int[]
        ) AS t("adGroupId", "date", "qs", "keywordCount")
        ON CONFLICT ("adGroupId", "date")
        DO UPDATE
           SET "qs"         = EXCLUDED."qs",
               "keywordCount" = EXCLUDED."keywordCount";`;
    }
  }
}
