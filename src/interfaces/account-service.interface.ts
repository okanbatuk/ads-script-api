import type {
  AccountDto,
  AccountScoreDto,
  CampaignDto,
} from "../dtos/index.js";
import type { AccountUpsertSchema } from "../schemas/index.js";

export interface IAccountService {
  getAll(include: boolean): Promise<{
    accounts: AccountDto[];
    total: number;
  }>;

  getAllChildren(
    parentId: number,
    include: boolean,
  ): Promise<{ subAccounts: AccountDto[]; total: number }>;

  getCampaigns(
    accountId: number,
    include: boolean,
  ): Promise<{ campaigns: CampaignDto[]; total: number }>;

  getAccountScores(
    accountId: number,
    days: number,
  ): Promise<{
    scores: AccountScoreDto[];
    total: number;
  }>;

  getBulkAccountScores(
    accountIds: number[],
    days: number,
  ): Promise<{
    scores: AccountScoreDto[];
    total: number;
  }>;

  getById(accountId: number): Promise<AccountDto | null>;
  getByAccountId(accountId: string): Promise<AccountDto | null>;

  upsert(items: AccountUpsertSchema[]): Promise<void>;

  setAccountScores(accountIds: number[], date: Date): Promise<void>;
}
