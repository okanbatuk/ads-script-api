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
  async getGlobalTrend(days: number = 7): Promise<GlobalScoreDto[]> {
    const rows = await this.prisma.globalScore.findMany({
      where: {
        date: { gte: startOfDay(subDays(new Date(), days)) },
      },
    });

    return GlobalScoreMapper.toDtos(rows);
  }

  async setGlobalScore(date: Date): Promise<void> {
    const rows = await this.prisma.$queryRaw<
      {
        qs: number;
        accountCount: number;
      }[]
    >`
      SELECT
        ROUND(AVG(qs::float), 2) AS qs,
        COUNT(*)                 AS "accountCount"
      FROM account_score
      WHERE date = ${date}::date`;

    if (!rows.length || rows[0].accountCount === 0)
      throw new ApiError(`No account_score data for date: ${formatDate(date)}`);

    const qs = Number(rows[0].qs);
    const accountCount = Number(rows[0].accountCount);

    await this.prisma.globalScore.upsert({
      where: { date },
      update: { qs, accountCount },
      create: { date, qs, accountCount },
    });
  }
}
