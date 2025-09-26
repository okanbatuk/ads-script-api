import { inject, injectable } from "inversify";
import { Response } from "express";
import { TYPES } from "../types/index.js";
import { sendResponse } from "../utils/index.js";
import { ApiError } from "../errors/api.error.js";

import type {
  IntBulkDto,
  IntIdParamDto,
  KeywordSetScoreSchema,
  KeywordUpsertSchema,
} from "../schemas/index.js";
import type { IdBulkDto, IdParamDto, KeywordUpsertDto } from "../dtos/index.js";
import type { IKeywordService } from "../interfaces/index.js";
import { KeywordScoresDto } from "src/dtos/keyword-scores.dto.js";

@injectable()
export class KeywordController {
  constructor(
    @inject(TYPES.KeywordService) private readonly service: IKeywordService,
  ) {}

  // GET /api/keywords/:id/scores?days=7
  getScores = async (
    req: GetScoresRequest<IdParamDto, IntIdParamDto>,
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
    req: GetByIdRequest<IdParamDto, IntIdParamDto>,
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
    req: UpsertRequest<KeywordUpsertDto[], KeywordUpsertSchema[]>,
    res: Response,
  ): Promise<void> => {
    console.log(`UPSERT CONTROLLERS /api/keywords`);
    const items = req.validatedBody;
    await this.service.upsertKeywords(items);
    sendResponse(res, 204, null, "Keywords upserted successfully.");
  };

  // POST /api/keywords/scores
  setScores = async (
    req: SetScoresRequest<KeywordScoresDto[], KeywordSetScoreSchema>,
    res: Response,
  ): Promise<void> => {
    console.log(`SET SCORES CONTROLLERS /api/keywords/scores`);
    const scores = req.validatedBody;
    await this.service.setKeywordScores(scores);
    sendResponse(res, 204, null, "Keywords scores set successfully.");
  };

  // POST /api/keywords/bulkscores?days=7
  getBulkScores = async (
    req: GetBulkScoresRequest<IdBulkDto, IntBulkDto>,
    res: Response,
  ): Promise<void> => {
    const { ids } = req.validatedBody;
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
