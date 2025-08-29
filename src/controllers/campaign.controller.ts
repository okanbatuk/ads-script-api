import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import type { ICampaignService } from "../interfaces";
import { TYPES } from "../types/inversify.types";
import { sendResponse } from "../utils/send-response";

@injectable()
export class CampaignController {
  constructor(
    @inject(TYPES.CampaignService) private readonly service: ICampaignService,
  ) {}

  // GET /campaign
  getAll = async (req: Request, res: Response): Promise<Response> => {
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
    await this.service.upsert(req.body);
    return sendResponse(
      res,
      201,
      undefined,
      "Campaigns created successfully retrieved.",
    );
  };
}
