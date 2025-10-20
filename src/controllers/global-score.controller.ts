import { Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../types/index.js";
import { sendResponse } from "../utils/index.js";

import type { IGlobalScoreService } from "../interfaces/index.js";
import type { IdParamDto, ScoreDateDto } from "../dtos/index.js";
import type { ScoreDateSchema } from "../schemas/global-score-date.schema.js";
import { IntIdParamDto } from "src/schemas/id-param.schema.js";

@injectable()
export class GlobalScoreController {
  constructor(
    @inject(TYPES.GlobalScoreService)
    private readonly service: IGlobalScoreService,
  ) {}

  // GET /api/global/:id?days=7
  public getGlobalTrend = async (
    req: GetScoresRequest<IdParamDto, IntIdParamDto>,
    res: Response,
  ): Promise<void> => {
    const { id } = req.validatedParams;
    const { days } = req.validatedQuery;
    const result = await this.service.getGlobalTrend(id, days);
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
    const { mccId, date } = req.validatedBody;
    await this.service.setGlobalScore(mccId, date);
    sendResponse(res, 204, null, "Global score set successfully.");
  };
}
