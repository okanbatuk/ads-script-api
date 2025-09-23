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
    req: GetScoresRequest<IntIdParamDto>,
    res: Response,
  ): Promise<void> => {
    const { id } = req.validatedParams;
    const days = req.validatedQuery?.days ?? 7;

    const result = await this.service.getKeywordScores(id, days);
    sendResponse(
      res,
      200,
      result,
      `All score records for Keyword ID: ${req.params.id} on ${req.query.days} days have been successfully retrieved.`,
    );
  };

  // GET /api/keywords/:id
  getById = async (
    req: GetByIdRequest<IntIdParamDto>,
    res: Response,
  ): Promise<void> => {
    const { id } = req.validatedParams;
    const dto = await this.service.getByKeywordId(id);
    if (!dto) throw new ApiError(`Keyword with ID: ${id} not found!`);
    sendResponse(
      res,
      200,
      dto,
      `Keyword with ID: ${id} retrieved successfully.`,
    );
  };

  // POST /api/keywords
  upsert = async (
    req: UpsertRequest<KeywordUpsertDto>,
    res: Response,
  ): Promise<void> => {
    const items = req.body;
    await this.service.upsertKeywords(items);
    sendResponse(res, 204, null, "Keywords upserted successfully.");
  };

  // POST /api/keywords/scores
  setScores = async (
    req: SetScoresRequest<KeywordSetScoreDto>,
    res: Response,
  ): Promise<void> => {
    const scores = req.body;
    await this.service.setKeywordScores(scores);
    sendResponse(res, 204, null, "Keywords scores set successfully.");
  };

  // POST /api/keywords/bulkscores?days=7
  getBulkScores = async (
    req: GetBulkScoresRequest<IntBulkDto>,
    res: Response,
  ): Promise<void> => {
    const { ids } = req.body;
    const days = req.validatedQuery?.days ?? 7;
    const result = await this.service.getBulkKeywordScores(ids, days);
    sendResponse(
      res,
      200,
      result,
      `Bulk scores for ${ids.length} keyword(s) over ${days} day(s) retrieved.`,
    );
  };
}
