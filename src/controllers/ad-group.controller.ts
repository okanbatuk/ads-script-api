import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../types/index.js";
import { sendResponse } from "../utils/index.js";
import { ApiError } from "../errors/api.error.js";

import type {
  AdGroupScoresSchema,
  AdGroupUpsertSchema,
  BigIntBulkDto,
  BigIntIdParamDto,
} from "../schemas/index.js";
import type {
  AdGroupScoresDto,
  AdGroupUpsertDto,
  IdBulkDto,
  IdParamDto,
} from "../dtos/index.js";
import type { IAdGroupService } from "../interfaces/index.js";

@injectable()
export class AdGroupController {
  constructor(
    @inject(TYPES.AdGroupService) private readonly service: IAdGroupService,
  ) {}

  // GET /api/adgroups/:id/keywords
  getAllKeywords = async (
    req: GetByIdRequest<IdParamDto, BigIntIdParamDto>,
    res: Response,
  ): Promise<void> => {
    const { id } = req.validatedParams;
    const { include } = req.query;
    const includeBool = include === "true" || include === "1" ? true : false;
    const result = await this.service.getAllKeywords(id, includeBool);
    sendResponse(
      res,
      200,
      result,
      "All Kewywords by Ad Group have been successfully retrieved.",
    );
  };

  // GET /api/adgroups/:id/scores?days=7
  getScores = async (
    req: GetScoresRequest<IdParamDto, BigIntIdParamDto>,
    res: Response,
  ): Promise<void> => {
    const { id } = req.validatedParams;
    const days = req.validatedQuery?.days ?? 7;

    const result = await this.service.getAdGroupScores(id, days);
    sendResponse(
      res,
      200,
      result,
      `All score records for Ad Group ID: ${id} on ${days} day(s) have been successfully retrieved.`,
    );
  };

  // GET /api/adgroups/:id
  getById = async (
    req: GetByIdRequest<IdParamDto, BigIntIdParamDto>,
    res: Response,
  ): Promise<void> => {
    const { id } = req.validatedParams;
    const dto = await this.service.getById(id);
    if (!dto) throw new ApiError(`Ad Group with ID: ${id} not found!`);
    sendResponse(
      res,
      200,
      dto,
      `Ad Group with ID: ${id} retrieved successfully.`,
    );
  };

  // POST /api/adgroups
  upsert = async (
    req: UpsertRequest<AdGroupUpsertDto[], AdGroupUpsertSchema[]>,
    res: Response,
  ): Promise<void> => {
    console.log(`UPSERT CONTROLLER /api/adgroups`);
    const items = req.validatedBody;
    await this.service.upsert(items);
    sendResponse(res, 204, null, "Ad Groups upserted successfully.");
  };

  // POST /api/adgroups/scores
  setScores = async (
    req: SetScoresRequest<AdGroupScoresDto, AdGroupScoresSchema>,
    res: Response,
  ): Promise<void> => {
    console.log(`SET SCORES CONTROLLER /api/adgroups/scores`);
    const { adGroupIds, date } = req.validatedBody;
    await this.service.setAdGroupScores(adGroupIds, date);

    sendResponse(res, 204, null, "Ad Groups scores set successfully.");
  };

  // POST /api/adgroups/bulkscores?days=7
  getBulkScores = async (
    req: GetBulkScoresRequest<IdBulkDto, BigIntBulkDto>,
    res: Response,
  ): Promise<void> => {
    const { ids } = req.validatedBody;
    const days = req.validatedQuery?.days ?? 7;
    const result = await this.service.getBulkAdGroupScores(ids, days);
    sendResponse(
      res,
      200,
      result,
      `Bulk scores for ${ids.length} ad group(s) over ${days} day(s) retrieved.`,
    );
  };
}
