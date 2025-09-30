import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../types/index.js";
import { sendResponse } from "../utils/index.js";
import { ApiError } from "../errors/api.error.js";

import type {
  AccountScoresSchema,
  AccountUpsertSchema,
  IntBulkDto,
  IntIdParamDto,
} from "../schemas/index.js";
import type {
  AccountScoresDto,
  AccountUpsertDto,
  IdBulkDto,
  IdParamDto,
} from "../dtos/index.js";
import type { IAccountService } from "../interfaces/index.js";

@injectable()
export class AccountController {
  constructor(
    @inject(TYPES.AccountService) private readonly service: IAccountService,
  ) {}

  // GET /api/accounts
  getAllParents = async (req: Request, res: Response): Promise<void> => {
    const { include } = req.query;
    const includeBool = !!include && (include === "true" || include === "1");
    const result = await this.service.getAll(includeBool);
    sendResponse(res, 200, result, "All parent accounts retrieved.");
  };

  // GET /api/accounts/:id/accounts
  getAllChildren = async (
    req: GetByIdRequest<IdParamDto, IntIdParamDto>,
    res: Response,
  ): Promise<void> => {
    const { id } = req.validatedParams;
    const { include } = req.query;
    const includeBool = include === "true" || include === "1" ? true : false;
    const result = await this.service.getAllChildren(id, includeBool);
    sendResponse(
      res,
      200,
      result,
      `All accounts have been successfully retrieved.`,
    );
  };

  // GET /api/accounts/:id/campaigns
  getAllCampaigns = async (
    req: GetByIdRequest<IdParamDto, IntIdParamDto>,
    res: Response,
  ) => {
    const { id } = req.validatedParams;
    const result = await this.service.getCampaigns(id);
    sendResponse(
      res,
      200,
      result,
      "All Campaigns by Account Id have been successfully retrieved.",
    );
  };

  // GET /api/accounts/:id/scores?days=7
  getScores = async (
    req: GetScoresRequest<IdParamDto, IntIdParamDto>,
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
    req: GetByIdRequest<IdParamDto, IntIdParamDto>,
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

  // GET /api/accounts/account/:accountId
  getByAccountId = async (req: Request, res: Response): Promise<void> => {
    const { accountId } = req.params;
    if (!accountId) throw new ApiError(`Does not provide an Accound ID!`);
    const dto = await this.service.getByAccountId(accountId);
    if (!dto)
      throw new ApiError(`Account with ID: ${accountId} not found`, 404);

    sendResponse(
      res,
      200,
      dto,
      `Account with ID: ${accountId} retrieved successfully.`,
    );
  };

  // POST /api/accounts
  upsert = async (
    req: UpsertRequest<AccountUpsertDto[], AccountUpsertSchema[]>,
    res: Response,
  ): Promise<void> => {
    console.log(`UPSERT CONTROLLER /api/accounts`);
    const items = req.validatedBody;
    await this.service.upsert(items);
    sendResponse(res, 204, null, "Accounts upserted successfully.");
  };

  // POST /api/accounts/scores
  setScores = async (
    req: SetScoresRequest<AccountScoresDto, AccountScoresSchema>,
    res: Response,
  ): Promise<void> => {
    console.log(`SET SCORES CONTROLLER /api/accounts/scores`);
    const { accountIds, date } = req.validatedBody;

    await this.service.setAccountScores(accountIds, date);
    sendResponse(res, 204, null, "Account scores set successfully.");
  };

  // POST /api/accounts/bulkscores?days=7
  getBulkScores = async (
    req: GetBulkScoresRequest<IdBulkDto, IntBulkDto>,
    res: Response,
  ): Promise<void> => {
    const { ids } = req.validatedBody;
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
