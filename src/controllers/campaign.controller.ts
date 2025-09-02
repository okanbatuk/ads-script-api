import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../types/index.js";
import { sendResponse } from "../utils/index.js";
import type { ICampaignService } from "../interfaces/index.js";
import { logger } from "../config/logger.config.js";

@injectable()
export class CampaignController {
  constructor(
    @inject(TYPES.CampaignService) private readonly service: ICampaignService,
  ) {}

  // GET /campaign
  getAll = async (req: Request, res: Response): Promise<Response> => {
    console.log(`------- GET ALL Campaigns --------`);
    const result = await this.service.getAll();
    return sendResponse(
      res,
      200,
      result,
      "All Campaigns successfully retrieved.",
    );
  };

  // POST /campaign
  upsert = async (req: Request, res: Response): Promise<Response> => {
    console.log(`------- UPSERT Campaigns --------`);
    await this.service.upsert(req.body);
    return sendResponse(
      res,
      201,
      undefined,
      "Campaigns created successfully retrieved.",
    );
  };
}
