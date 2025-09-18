import { inject, injectable } from "inversify";
import { startOfDay, subDays } from "date-fns";
import { TYPES } from "../types/index.js";
import { Prisma, PrismaClient } from "../models/prisma.js";
import { KeywordMapper, KeywordScoreMapper } from "../mappers/index.js";

import type { IKeywordService } from "../interfaces/index.js";
import type { KeywordDto, KeywordScoreDto } from "../dtos/index.js";

@injectable()
export class KeywordService implements IKeywordService {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient,
  ) {}

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

  async upsertKeywords(items: KeywordDto[]): Promise<void> {
    const data = items.map((i) => ({
      criterionId: BigInt(i.criterionId),
      keyword: i.keyword,
      adGroupId: BigInt(i.adGroupId),
    }));

    await this.prisma.$transaction(async (tx) => {
      for (const row of data) {
        await tx.keyword.upsert({
          where: {
            criterionId_adGroupId: {
              criterionId: row.criterionId,
              adGroupId: row.adGroupId,
            },
          },
          update: { keyword: row.keyword },
          create: row,
        });
      }
    });
  }

  async setKeywordScores(
    scores: {
      keywordId: number;
      date: Date;
      qs: number;
    }[],
  ): Promise<void> {
    await this.prisma.keywordScore.createMany({
      data: scores,
      skipDuplicates: true,
    });
  }
}
