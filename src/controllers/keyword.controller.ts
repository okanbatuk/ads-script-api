import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import type { IKeywordService } from "../interfaces";
import { TYPES } from "../types/inversify.types";
import { sendResponse } from "../utils/send-response";

@injectable()
export class KeywordController {
  constructor(
    @inject(TYPES.KeywordService) private readonly service: IKeywordService,
  ) {}

  getKeywordsByAdGroup = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    const result = await this.service.getAll(req.params.id);
    return sendResponse(
      res,
      200,
      result,
      "All Keywords by AdGroup successfully retrieved.",
    );
  };

  upsert = async (req: Request, res: Response): Promise<Response> => {
    await this.service.upsert(req.body);
    return sendResponse(
      res,
      201,
      undefined,
      "Keywords created successfully retrieved.",
    );
  };
}
