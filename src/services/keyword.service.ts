import { inject, injectable } from "inversify";
import { startOfDay, subDays } from "date-fns";
import { TYPES } from "../types/index.js";
import { Keyword, Prisma, PrismaClient, Status } from "../models/prisma.js";
import { KeywordMapper, KeywordScoreMapper } from "../mappers/index.js";

import type {
  KeywordBulkSchema,
  KeywordSetScoreSchema,
  KeywordUpsertSchema,
} from "../schemas/index.js";
import type { IKeywordService } from "../interfaces/index.js";
import type { KeywordDto, KeywordScoreDto } from "../dtos/index.js";
import { ApiError } from "src/errors/api.error.js";

@injectable()
export class KeywordService implements IKeywordService {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient,
  ) {}

  transform = (row: KeywordUpsertSchema): Omit<Keyword, "id"> => {
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

  async getKeywordIds(pairs: KeywordBulkSchema): Promise<KeywordDto[]> {
    const where: Prisma.KeywordWhereInput = {
      OR: pairs.map((p) => ({
        criterionId: p.criterionId,
        adGroupId: p.adGroupId,
      })),
    };
    const rows = await this.prisma.keyword.findMany({
      where,
      include: { adGroup: true },
    });
    return rows.map((r) => KeywordMapper.toDto(r));
  }

  async getKeywordScores(
    id: number,
    days: number = 7,
  ): Promise<{ scores: KeywordScoreDto[]; total: number }> {
    const where: Prisma.KeywordScoreWhereInput = {
      keywordId: id,
      date: { gte: startOfDay(subDays(new Date(), days)) },
    };

    const [rows, total] = await Promise.all([
      this.prisma.keywordScore.findMany({
        where,
        orderBy: { date: "desc" },
      }),
      this.prisma.keywordScore.count({ where }),
    ]);

    return { scores: KeywordScoreMapper.toDtos(rows), total };
  }

  async getBulkKeywordScores(
    ids: number[],
    days: number = 7,
  ): Promise<{ scores: KeywordScoreDto[]; total: number }> {
    const where: Prisma.KeywordScoreWhereInput = {
      keywordId: { in: ids },
      date: { gte: startOfDay(subDays(new Date(), days)) },
    };

    const [rows, total] = await Promise.all([
      this.prisma.keywordScore.findMany({
        where,
        orderBy: { date: "desc" },
      }),
      this.prisma.keywordScore.count({ where }),
    ]);

    return { scores: KeywordScoreMapper.toDtos(rows), total };
  }

  async getByKeywordId(keywordId: number): Promise<KeywordDto | null> {
    const row = await this.prisma.keyword.findUnique({
      where: { id: keywordId },
    });
    return row ? KeywordMapper.toDto(row) : null;
  }

  async upsertKeywords(items: KeywordUpsertSchema[]): Promise<void> {
    const data = items.map((i) => this.transform(i));
    await this.prisma.$transaction(async (tx) => {
      for (const row of data) {
        await tx.keyword.upsert({
          where: {
            criterionId_adGroupId: {
              criterionId: row.criterionId,
              adGroupId: row.adGroupId,
            },
          },
          update: { keyword: row.keyword, status: row.status },
          create: row,
        });
      }
    });
  }

  async setKeywordScores(scores: KeywordSetScoreSchema): Promise<void> {
    for (let s of scores) {
      const keyword = await this.prisma.keyword.findUnique({
        where: {
          criterionId_adGroupId: {
            criterionId: s.keywordId,
            adGroupId: s.adGroupId,
          },
        },
        select: { id: true },
      });

      if (!keyword)
        throw new ApiError(`There is a keyword that has not been upserted.`);

      await this.prisma.keywordScore.create({
        data: {
          keywordId: keyword.id,
          date: s.date,
          qs: s.qs,
        },
      });
    }
  }
}
