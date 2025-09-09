import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../types/index.js";
import { IAccountService } from "../interfaces/index.js";
import { sendResponse, serializeEntity } from "../utils/index.js";

@injectable()
export class AccountController {
  constructor(
    @inject(TYPES.AccountService) private readonly service: IAccountService,
  ) {}

  // GET /account
  getAll = async (req: Request, res: Response): Promise<Response> => {
    const result = await this.service.getAll();
    return sendResponse(
      res,
      200,
      serializeEntity(result),
      "All Accounts successfully retrieved",
    );
  };

  // POST /account
  create = async (req: Request, res: Response): Promise<Response> => {
    console.log("--- CREATE Account ---");
    await this.service.create(req.body);
    return sendResponse(res, 201, undefined, "Account created successfully.");
  };
}
