import { PrismaClient } from "@prisma/client";
import { inject, injectable } from "inversify";
import { startOfDay, subDays } from "date-fns";
import { TYPES } from "../types/index.js";
import { ApiError } from "../errors/api.error.js";
import { formatDate } from "../utils/date.formatter.js";
import { GlobalScoreMapper } from "../mappers/global-score.mapper.js";

import type { GlobalScoreDto } from "../dtos/index.js";
import type { IGlobalScoreService } from "../interfaces/index.js";

@injectable()
export class GlobalScoreService implements IGlobalScoreService {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient,
  ) {}
  async getGlobalTrend(
    mccId: number,
    days: number = 7,
  ): Promise<GlobalScoreDto[]> {
    const rows = await this.prisma.globalScore.findMany({
      where: {
        mccId,
        date: { gte: startOfDay(subDays(new Date(), days)) },
      },
    });

    return GlobalScoreMapper.toDtos(rows);
  }

  async setGlobalScore(mccId: number, date: Date): Promise<void> {
    const scores = await this.prisma.accountScore.findMany({
      where: { account: { parentId: mccId }, date },
      select: { qs: true },
    });

    if (scores.length === 0)
      throw new ApiError(`There is no scores for this ${mccId} MCC`, 404);
    const qsAvg = scores.reduce((s, c) => s + c.qs, 0) / scores.length;

    await this.prisma.$executeRaw`
      INSERT INTO "GlobalScore" ("mccId", "date", "qs", "accountCount")
      VALUES (
        ${mccId}::int,
        ${date}::date,
        ${qsAvg}::double precision,
        ${scores.length}::int
      )
      ON CONFLICT ("mccId", "date")
      DO UPDATE
         SET "qs"           = EXCLUDED."qs",
             "accountCount" = EXCLUDED."accountCount"`;
  }
}
