import type { AccountDto, AccountScoreDto } from "../dtos/index.js";
import type { AccountUpsertSchema } from "../schemas/index.js";

export interface IAccountService {
  getAccountScores(
    accountId: bigint,
    days: number,
  ): Promise<{
    scores: AccountScoreDto[];
    total: number;
  }>;

  getBulkAccountScores(
    accountIds: bigint[],
    days: number,
  ): Promise<{
    scores: AccountScoreDto[];
    total: number;
  }>;

  getById(accountId: bigint): Promise<AccountDto | null>;

  upsert(items: AccountUpsertSchema[]): Promise<void>;

  setAccountScores(accountIds: bigint[], date: Date): Promise<void>;
}
