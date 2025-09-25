import type { AccountDto, AccountScoreDto } from "../dtos/index.js";
import type { AccountUpsertSchema } from "../schemas/index.js";

export interface IAccountService {
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

  upsert(items: AccountUpsertSchema[]): Promise<void>;

  setAccountScores(accountIds: number[], date: Date): Promise<void>;
}
