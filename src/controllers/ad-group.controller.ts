import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../types/index.js";
import { sendResponse } from "../utils/index.js";
import { ApiError } from "../errors/api.error.js";

import type {
  AdGroupBulkBodyDto,
  AdGroupScoresDto,
  AdGroupUpsertDto,
  BigIntIdParamDto,
} from "../schemas/index.js";
import type { IAdGroupService } from "../interfaces/index.js";

@injectable()
export class AdGroupController {
  constructor(
    @inject(TYPES.AdGroupService) private readonly service: IAdGroupService,
  ) {}

  // GET /api/adgroups/:id/scores?days=7
  getScores = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.validatedParams as BigIntIdParamDto;
    const days = Number(req.validatedQuery?.days ?? "7");

    const result = await this.service.getAdGroupScores(id, days);
    return sendResponse(
      res,
      200,
      result,
      `All score records for Ad Group ID: ${id} on ${days} day(s) have been successfully retrieved.`,
    );
  };

  // GET /api/adgroups/bulkscores?days=7
  getBulkScores = async (req: Request, res: Response): Promise<Response> => {
    const { ids }: AdGroupBulkBodyDto = req.body;
    const days = Number(req.validatedQuery?.days ?? "7");
    const result = await this.service.getBulkAdGroupScores(ids, days);
    return sendResponse(
      res,
      200,
      result,
      `Bulk scores for ${ids.length} ad group(s) over ${days} day(s) retrieved.`,
    );
  };

  // GET /api/adgroups/:id
  getById = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.validatedParams as BigIntIdParamDto;
    const dto = await this.service.getById(id);
    if (!dto) throw new ApiError(`Ad Group with ID: ${id} not found!`);
    return sendResponse(
      res,
      200,
      dto,
      `Ad Group with ID: ${id} retrieved successfully.`,
    );
  };

  // POST /api/adgroups
  upsert = async (req: Request, res: Response): Promise<Response> => {
    const items: AdGroupUpsertDto[] = req.body;
    await this.service.upsert(items);
    return sendResponse(res, 204, null, "Ad Groups upserted successfully.");
  };

  // POST /api/adgroups/scores
  setScores = async (req: Request, res: Response): Promise<Response> => {
    const { adGroupIds, date }: AdGroupScoresDto = req.body;

    await this.service.setAdGroupScores(adGroupIds, date);

    return sendResponse(res, 204, null, "Ad Groups scores set successfully.");
  };
}
