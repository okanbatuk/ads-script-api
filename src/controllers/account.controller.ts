import { Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../types/index.js";
import { sendResponse } from "../utils/index.js";
import { ApiError } from "../errors/api.error.js";
import type { IAccountService } from "../interfaces/index.js";
import type {
  AccountScoresDto,
  AccountUpsertDto,
  BigIntBulkDto,
  BigIntIdParamDto,
} from "../schemas/index.js";

@injectable()
export class AccountController {
  constructor(
    @inject(TYPES.AccountService) private readonly service: IAccountService,
  ) {}

  // GET /api/accounts/:id/scores?days=7
  getScores = async (
    req: GetScoresRequest<BigIntIdParamDto>,
    res: Response,
  ): Promise<void> => {
    const { id } = req.validatedParams;
    const days = req.validatedQuery?.days ?? 7;

    const result = await this.service.getAccountScores(id, days);
    sendResponse(
      res,
      200,
      result,
      `All score records for Account ID: ${id} on ${days} day(s) have been successfully retrieved.`,
    );
  };

  // GET /api/accounts/:id
  getById = async (
    req: GetByIdRequest<BigIntIdParamDto>,
    res: Response,
  ): Promise<void> => {
    const { id } = req.validatedParams;

    const dto = await this.service.getById(id);
    if (!dto) throw new ApiError(`Account with ID: ${id} not found`, 404);

    sendResponse(
      res,
      200,
      dto,
      `Account with ID: ${id} retrieved successfully.`,
    );
  };

  // POST /api/accounts
  upsert = async (
    req: UpsertRequest<AccountUpsertDto>,
    res: Response,
  ): Promise<void> => {
    console.log(`UPSERT CONTROLLER /api/accounts`);
    const items = req.body;
    await this.service.upsert(items);
    sendResponse(res, 204, null, "Accounts upserted successfully.");
  };

  // POST /api/accounts/scores
  setScores = async (
    req: SetScoresRequest<AccountScoresDto>,
    res: Response,
  ): Promise<void> => {
    console.log(`SET SCORES CONTROLLER /api/accounts/scores`);
    const { accountIds, date } = req.body;

    await this.service.setAccountScores(accountIds, date);
    sendResponse(res, 204, null, "Account scores set successfully.");
  };

  // POST /api/accounts/bulkscores?days=7
  getBulkScores = async (
    req: GetBulkScoresRequest<BigIntBulkDto>,
    res: Response,
  ): Promise<void> => {
    const { ids } = req.body;
    const days = req.validatedQuery?.days ?? 7;

    const result = await this.service.getBulkAccountScores(ids, days);
    sendResponse(
      res,
      200,
      result,
      `Bulk scores for ${ids.length} account(s) over ${days} day(s) retrieved.`,
    );
  };
}
