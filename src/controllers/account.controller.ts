import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../types/index.js";
import { IAccountService } from "../interfaces/index.js";
import { sendResponse } from "src/utils";

@injectable()
export class AccountController {
  constructor(
    @inject(TYPES.AccountService) private readonly service: IAccountService,
  ) {}

  // POST /account
  create = async (req: Request, res: Response): Promise<Response> => {
    console.log("--- CREATE Account ---");
    await this.service.create(req.body);
    return sendResponse(res, 201, undefined, "Account created successfully.");
  };
}
