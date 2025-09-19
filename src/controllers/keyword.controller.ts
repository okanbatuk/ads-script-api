import { inject, injectable } from "inversify";
import { Response } from "express";
import { TYPES } from "../types/index.js";
import { sendResponse } from "../utils/index.js";
import { ApiError } from "../errors/api.error.js";

import type { IKeywordService } from "../interfaces/index.js";
import type {
  IntBulkDto,
  IntIdParamDto,
  KeywordSetScoreDto,
  KeywordUpsertDto,
} from "../schemas/index.js";

@injectable()
export class KeywordController {
  constructor(
    @inject(TYPES.KeywordService) private readonly service: IKeywordService,
  ) {}

  // GET /api/keywords/:id/scores?days=7
  getScores = async (
    req: IdAndDaysRequest<IntIdParamDto>,
    res: Response,
  ): Promise<void> => {
    const result = await this.service.getKeywordScores(
      req.validatedParams.id,
      req.validatedQuery.days,
    );
    sendResponse(
      res,
      200,
      result,
      `All score records for Keyword ID: ${req.validatedParams.id} on ${req.validatedQuery.days} days have been successfully retrieved.`,
    );
  };

  // GET /api/keywords/bulkscores?days=7
  getBulkScores = async (
    req: DaysAndBodyRequest<IntBulkDto>,
    res: Response,
  ): Promise<void> => {
    const result = await this.service.getBulkKeywordScores(
      req.body.ids,
      req.validatedQuery.days,
    );
    sendResponse(
      res,
      200,
      result,
      `Bulk scores for ${req.body.ids.length} keyword(s) over ${req.validatedQuery.days} day(s) retrieved.`,
    );
  };

  // GET /api/keywords/:id
  getById = async (
    req: IdOnlyRequest<IntIdParamDto>,
    res: Response,
  ): Promise<void> => {
    const dto = await this.service.getByKeywordId(req.validatedParams.id);
    if (!dto)
      throw new ApiError(
        `Keyword with ID: ${req.validatedParams.id} not found!`,
        404,
      );
    sendResponse(
      res,
      200,
      dto,
      `Keyword with ID: ${req.validatedParams.id} retrieved successfully.`,
    );
  };

  // POST /api/keywords
  upsert = async (
    req: BodyOnlyRequest<KeywordUpsertDto[]>,
    res: Response,
  ): Promise<void> => {
    await this.service.upsertKeywords(req.body);
    sendResponse(res, 204, null, "Keywords upserted successfully.");
  };

  // POST /api/keywords/scores
  setScores = async (
    req: BodyOnlyRequest<KeywordSetScoreDto>,
    res: Response,
  ): Promise<void> => {
    await this.service.setKeywordScores(req.body);
    sendResponse(res, 204, null, "Keywords scores set successfully.");
  };
}
