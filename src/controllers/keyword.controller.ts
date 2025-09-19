import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../types/index.js";
import { sendResponse } from "../utils/index.js";
import { ApiError } from "../errors/api.error.js";

import type { IKeywordService } from "../interfaces/index.js";
import type {
  IntIdParamDto,
  KeywordBulkBodyDto,
  KeywordSetScoreDto,
  KeywordUpsertDto,
} from "../schemas/index.js";

@injectable()
export class KeywordController {
  constructor(
    @inject(TYPES.KeywordService) private readonly service: IKeywordService,
  ) {}

  // GET /api/keywords/:id/scores?days=7
  getScores = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.validatedParams as IntIdParamDto;
    const days = Number(req.validatedQuery?.days ?? "7");
    const result = await this.service.getKeywordScores(id, days);
    sendResponse(
      res,
      200,
      result,
      `All score records for Keyword ID: ${id} on ${days} days have been successfully retrieved.`,
    );
  };

  // GET /api/keywords/bulkscores?days=7
  getBulkScores = async (req: Request, res: Response): Promise<void> => {
    const { ids }: KeywordBulkBodyDto = req.body;
    const days = Number(req.validatedQuery?.days ?? "7");
    const result = await this.service.getBulkKeywordScores(ids, days);
    sendResponse(
      res,
      200,
      result,
      `Bulk scores for ${ids.length} keyword(s) over ${days} day(s) retrieved.`,
    );
  };

  // GET /api/keywords/:id
  getById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.validatedParams as IntIdParamDto;
    const dto = await this.service.getByKeywordId(id);
    if (!dto) throw new ApiError(`Keyword with ID: ${id} not found!`, 404);
    sendResponse(
      res,
      200,
      dto,
      `Keyword with ID: ${id} retrieved successfully.`,
    );
  };

  // POST /api/keywords
  upsert = async (req: Request, res: Response): Promise<void> => {
    const items: KeywordUpsertDto[] = req.body;
    await this.service.upsertKeywords(items);
    sendResponse(res, 204, null, "Keywords upserted successfully.");
  };

  // POST /api/keywords/scores
  setScores = async (req: Request, res: Response): Promise<void> => {
    const scores: KeywordSetScoreDto = req.body;
    await this.service.setKeywordScores(scores);
    sendResponse(res, 204, null, "Keywords scores set successfully.");
  };
}
