import { Request, Response } from "express";
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
    req: GetScoresRequest<BigIntIdParamDto>,
    res: Response,
  ): Promise<void> => {
    const { id } = req.validatedParams;
    const days = req.validatedQuery?.days ?? 7;
    const result = await this.service.getCampaignScores(id, days);
    sendResponse(
      res,
      200,
      result,
      `All score records for Campaign ID: ${id} on ${days} day(s) have been successfully retrieved.`,
    );
  };

  // GET /api/campaigns/:id
  getById = async (
    req: GetByIdRequest<BigIntIdParamDto>,
    res: Response,
  ): Promise<void> => {
    const { id } = req.validatedParams;
    const dto = await this.service.getById(id);
    if (!dto) throw new ApiError(`Campaign with ID: ${id} not found`, 404);

    sendResponse(
      res,
      200,
      dto,
      `Campaign with ID: ${id} retrieved successfully.`,
    );
  };

  // /api/campaigns
  upsertCampaigns = async (
    req: UpsertRequest<CampaignUpsertDto>,
    res: Response,
  ): Promise<void> => {
    const items = req.body;
    await this.service.upsertCampaigns(items);
    sendResponse(res, 204, null, "Campaign upserted successfully.");
  };

  // /api/campaigns/scores
  setScores = async (
    req: SetScoresRequest<CampaignScoresDto>,
    res: Response,
  ): Promise<void> => {
    const { campaignIds, date } = req.body;
    await this.service.setCampaignScores(campaignIds, date);

    sendResponse(res, 204, null, "Ad Groups scores set successfully.");
  };

  // POST /api/campaigns/bulkscores?days=7
  getBulkScores = async (
    req: GetBulkScoresRequest<BigIntBulkDto>,
    res: Response,
  ): Promise<void> => {
    const { ids } = req.body;
    const days = req.validatedQuery?.days ?? 7;
    const result = await this.service.getBulkCampaignScores(ids, days);

    sendResponse(
      res,
      200,
      result,
      `Bulk scores for ${ids.length} campaign(s) over ${days} day(s) retrieved.`,
    );
  };
}
