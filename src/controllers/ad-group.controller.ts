import { inject, injectable } from "inversify";
import { Response } from "express";
import { TYPES } from "../types/index.js";
import { sendResponse } from "../utils/index.js";
import { ApiError } from "../errors/api.error.js";

import type {
  AdGroupScoresDto,
  AdGroupUpsertDto,
  BigIntBulkDto,
  BigIntIdParamDto,
  DaysQueryDto,
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
    const { days = 7 } = req.validatedQuery as DaysQueryDto;

    const result = await this.service.getAdGroupScores(id, days);
    return sendResponse(
      res,
      200,
      result,
      `All score records for Ad Group ID: ${req.validatedParams.id} on ${req.validatedQuery.days} day(s) have been successfully retrieved.`,
    );
  };

  // GET /api/adgroups/bulkscores?days=7
  getBulkScores = async (req: Request, res: Response): Promise<Response> => {
    const { ids }: AdGroupBulkBodyDto = req.body;
    const { days = 7 } = req.validatedQuery as DaysQueryDto;
    const result = await this.service.getBulkAdGroupScores(ids, days);
    return sendResponse(
      res,
      200,
      result,
      `Bulk scores for ${req.body.ids.length} ad group(s) over ${req.validatedQuery.days} day(s) retrieved.`,
    );
  };

  // GET /api/adgroups/:id
  getById = async (
    req: IdOnlyRequest<BigIntIdParamDto>,
    res: Response,
  ): Promise<Response> => {
    const dto = await this.service.getById(req.validatedParams.id);
    if (!dto)
      throw new ApiError(
        `Ad Group with ID: ${req.validatedParams.id} not found!`,
      );
    return sendResponse(
      res,
      200,
      dto,
      `Ad Group with ID: ${req.validatedParams.id} retrieved successfully.`,
    );
  };

  // POST /api/adgroups
  upsert = async (
    req: BodyOnlyRequest<AdGroupUpsertDto[]>,
    res: Response,
  ): Promise<Response> => {
    await this.service.upsert(req.body);
    return sendResponse(res, 204, null, "Ad Groups upserted successfully.");
  };

  // POST /api/adgroups/scores
  setScores = async (
    req: BodyOnlyRequest<AdGroupScoresDto>,
    res: Response,
  ): Promise<Response> => {
    await this.service.setAdGroupScores(req.body.adGroupIds, req.body.date);

    return sendResponse(res, 204, null, "Ad Groups scores set successfully.");
  };
}
