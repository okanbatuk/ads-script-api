import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../types/index.js";
import { sendResponse } from "../utils/index.js";
import type { IKeywordService } from "../interfaces/index.js";

@injectable()
export class KeywordController {
  constructor(
    @inject(TYPES.KeywordService) private readonly service: IKeywordService,
  ) {}

  getKeywordsByAdGroup = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    console.log(`------- GET Keywords By Ad Group --------`);
    const result = await this.service.getAll(req.params.id);
    return sendResponse(
      res,
      200,
      result,
      "All Keywords by AdGroup successfully retrieved.",
    );
  };

  upsert = async (req: Request, res: Response): Promise<Response> => {
    console.log(`------- UPSERT Campaigns --------`);
    console.log(`Req body --> ${req.body}`);
    await this.service.upsert(req.body);
    return sendResponse(
      res,
      201,
      undefined,
      "Keywords created successfully retrieved.",
    );
  };
}
