import { Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../types/index.js";
import { sendResponse } from "../utils/index.js";
import { ApiError } from "../errors/api.error.js";

import type {
  BigIntBulkDto,
  BigIntIdParamDto,
  CampaignScoresDto,
  CampaignUpsertDto,
} from "../schemas/index.js";
import type { ICampaignService } from "../interfaces/index.js";

@injectable()
export class CampaignController {
  constructor(
    @inject(TYPES.CampaignService) private readonly service: ICampaignService,
  ) {}

  // GET /api/campaigns/:id/scores?days=7
  getScores = async (
    req: IdAndDaysRequest<BigIntIdParamDto>,
    res: Response,
  ): Promise<void> => {
    const result = await this.service.getCampaignScores(
      req.validatedParams.id,
      req.validatedQuery.days,
    );
    sendResponse(
      res,
      200,
      result,
      `All score records for Campaign ID: ${req.validatedParams.id} on ${req.validatedQuery.days} day(s) have been successfully retrieved.`,
    );
  };

  // GET /api/campaigns/bulkscores?days=7
  getBulkScores = async (
    req: DaysAndBodyRequest<BigIntBulkDto>,
    res: Response,
  ): Promise<void> => {
    const result = await this.service.getBulkCampaignScores(
      req.body.ids,
      req.validatedQuery.days,
    );

    sendResponse(
      res,
      200,
      result,
      `Bulk scores for ${req.body.ids.length} campaign(s) over ${req.validatedQuery.days} day(s) retrieved.`,
    );
  };

  // GET /api/campaigns/:id
  getById = async (
    req: IdOnlyRequest<BigIntIdParamDto>,
    res: Response,
  ): Promise<void> => {
    const dto = await this.service.getById(req.validatedParams.id);
    if (!dto)
      throw new ApiError(
        `Campaign with ID: ${req.validatedParams.id} not found`,
        404,
      );

    sendResponse(
      res,
      200,
      dto,
      `Campaign with ID: ${req.validatedParams.id} retrieved successfully.`,
    );
  };

  // /api/campaigns
  upsertCampaigns = async (
    req: BodyOnlyRequest<CampaignUpsertDto[]>,
    res: Response,
  ): Promise<void> => {
    await this.service.upsertCampaigns(req.body);
    sendResponse(res, 204, null, "Campaign upserted successfully.");
  };

  // /api/campaigns/scores
  setScores = async (
    req: BodyOnlyRequest<CampaignScoresDto>,
    res: Response,
  ): Promise<void> => {
    await this.service.setCampaignScores(req.body.campaignIds, req.body.date);

    sendResponse(res, 204, null, "Ad Groups scores set successfully.");
  };
}
