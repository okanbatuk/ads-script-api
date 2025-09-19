import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../types/index.js";
import { sendResponse } from "../utils/index.js";
import { ApiError } from "../errors/api.error.js";

import type {
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
  getScores = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.validatedParams as BigIntIdParamDto;
    const days = Number(req.validatedQuery?.days ?? "7");
    const result = await this.service.getCampaignScores(id, days);
    return sendResponse(
      res,
      200,
      result,
      `All score records for Campaign ID: ${id} on ${days} day(s) have been successfully retrieved.`,
    );
  };

  // GET /api/campaigns/bulkscores?days=7
  getBulkScores = async (req: Request, res: Response): Promise<Response> => {
    const { ids } = req.body;
    const days = Number(req.validatedQuery?.days ?? "7");

    const result = await this.service.getBulkCampaignScores(ids, days);

    return sendResponse(
      res,
      200,
      result,
      `Bulk scores for ${ids.length} campaign(s) over ${days} day(s) retrieved.`,
    );
  };

  // GET /api/campaigns/:id
  getById = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.validatedParams as BigIntIdParamDto;
    const dto = await this.service.getById(id);
    if (!dto) throw new ApiError(`Campaign with ID: ${id} not found`);

    return sendResponse(
      res,
      200,
      dto,
      `Campaign with ID: ${id} retrieved successfully.`,
    );
  };

  // /api/campaigns
  upsertCampaigns = async (req: Request, res: Response): Promise<Response> => {
    const items: CampaignUpsertDto[] = req.body;
    await this.service.upsertCampaigns(items);
    return sendResponse(res, 204, null, "Campaign upserted successfully.");
  };

  // /api/campaigns/scores
  setScores = async (req: Request, res: Response): Promise<Response> => {
    const { campaignIds, date }: CampaignScoresDto = req.body;
    await this.service.setCampaignScores(campaignIds, date);

    return sendResponse(res, 204, null, "Ad Groups scores set successfully.");
  };
}
