import { Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../types/index.js";
import { sendResponse } from "../utils/index.js";
import { ApiError } from "../errors/api.error.js";

import type {
  BigIntBulkDto,
  BigIntIdParamDto,
  CampaignScoresSchema,
  CampaignUpsertSchema,
} from "../schemas/index.js";
import type {
  CampaignScoresDto,
  CampaignUpsertDto,
  IdBulkDto,
  IdParamDto,
} from "../dtos/index.js";
import type { ICampaignService } from "../interfaces/index.js";

@injectable()
export class CampaignController {
  constructor(
    @inject(TYPES.CampaignService) private readonly service: ICampaignService,
  ) {}

  // GET /api/campaigns/:id/adgroups
  getAdGroups = async (
    req: GetByIdRequest<IdParamDto, BigIntIdParamDto>,
    res: Response,
  ): Promise<void> => {
    const { id } = req.validatedParams;
    const result = await this.service.getAdGroups(id);
    sendResponse(
      res,
      200,
      result,
      "All Ad Groups by CampaignID have been successfully retrieved.",
    );
  };

  // GET /api/campaigns/:id/scores?days=7
  getScores = async (
    req: GetScoresRequest<IdParamDto, BigIntIdParamDto>,
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
    req: GetByIdRequest<IdParamDto, BigIntIdParamDto>,
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

  // POST /api/campaigns
  upsertCampaigns = async (
    req: UpsertRequest<CampaignUpsertDto[], CampaignUpsertSchema[]>,
    res: Response,
  ): Promise<void> => {
    console.log(`UPSERT CONTROLLER /api/campaigns`);
    const items = req.validatedBody;
    await this.service.upsertCampaigns(items);
    sendResponse(res, 204, null, "Campaign upserted successfully.");
  };

  // POST /api/campaigns/scores
  setScores = async (
    req: SetScoresRequest<CampaignScoresDto, CampaignScoresSchema>,
    res: Response,
  ): Promise<void> => {
    console.log(`SET SCORES CONTROLLER /api/campaigns/scores`);
    const { campaignIds, date } = req.validatedBody;
    await this.service.setCampaignScores(campaignIds, date);

    sendResponse(res, 204, null, "Ad Groups scores set successfully.");
  };

  // POST /api/campaigns/bulkscores?days=7
  getBulkScores = async (
    req: GetBulkScoresRequest<IdBulkDto, BigIntBulkDto>,
    res: Response,
  ): Promise<void> => {
    const { ids } = req.validatedBody;
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
