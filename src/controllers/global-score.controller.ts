import { Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../types/index.js";
import { sendResponse } from "../utils/index.js";

import type { IGlobalScoreService } from "../interfaces/index.js";
import type { ScoreDateDto } from "../dtos/index.js";
import type { ScoreDateSchema } from "../schemas/global-score-date.schema.js";

@injectable()
export class GlobalScoreController {
  constructor(
    @inject(TYPES.GlobalScoreService)
    private readonly service: IGlobalScoreService,
  ) {}

  // GET /api/global?days=7
  public getGlobalTrend = async (
    req: GetGlobalTrend,
    res: Response,
  ): Promise<void> => {
    const { days } = req.validatedQuery;
    const result = await this.service.getGlobalTrend(days);
    sendResponse(
      res,
      200,
      result,
      `Global quality score trend for ${days} day(s) retrieved successfully.`,
    );
  };

  // POST /api/global
  public setGlobalScore = async (
    req: SetScoresRequest<ScoreDateDto, ScoreDateSchema>,
    res: Response,
  ): Promise<void> => {
    console.log(`Set Global Score /api/global`);
    const { date } = req.validatedBody;
    const dateObj = new Date(date);
    await this.service.setGlobalScore(dateObj);
    sendResponse(res, 204, null, "Global score set successfully.");
  };
}
