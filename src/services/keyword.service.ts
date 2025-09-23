import { inject, injectable } from "inversify";
import { startOfDay, subDays } from "date-fns";
import { TYPES } from "../types/index.js";
import { Keyword, Prisma, PrismaClient, Status } from "../models/prisma.js";
import { KeywordMapper, KeywordScoreMapper } from "../mappers/index.js";

import type { IKeywordService } from "../interfaces/index.js";
import type { KeywordDto, KeywordScoreDto } from "../dtos/index.js";
import type { KeywordSetScoreDto, KeywordUpsertDto } from "../schemas/index.js";

@injectable()
export class KeywordService implements IKeywordService {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient,
  ) {}

  transform = (row: KeywordUpsertDto): Omit<Keyword, "id"> => {
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

  async upsertKeywords(items: KeywordUpsertDto[]): Promise<void> {
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

  async setKeywordScores(scores: KeywordSetScoreDto): Promise<void> {
    await this.prisma.keywordScore.createMany({
      data: scores,
      skipDuplicates: true,
    });
  }
}
