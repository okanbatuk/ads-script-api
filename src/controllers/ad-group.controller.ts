import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../types/index.js";
import { sendResponse } from "../utils/index.js";
import type { IAdGroupService } from "../interfaces/index.js";

@injectable()
export class AdGroupController {
  constructor(
    @inject(TYPES.AdGroupService) private readonly service: IAdGroupService,
  ) {}

  getAdGroupsByCampaign = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    console.log(`------- GET Ad Groups By Campaign --------`);
    const result = await this.service.getAll(req.params.id);
    return sendResponse(
      res,
      200,
      result,
      "All AdGroups successfully retrieved.",
    );
  };

  upsert = async (req: Request, res: Response): Promise<Response> => {
    console.log(`------- UPSERT Ad Groups --------`);
    console.log(`Req body --> ${req.body}`);
    await this.service.upsert(req.body);
    return sendResponse(
      res,
      201,
      undefined,
      "AdGroups created successfully retrieved.",
    );
  };
}
