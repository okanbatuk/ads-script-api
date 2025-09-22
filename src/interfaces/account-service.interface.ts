import type { AccountDto, AccountScoreDto } from "../dtos/index.js";
import { AccountUpsertDto } from "../schemas/index.js";

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

  upsert(items: AccountUpsertDto[]): Promise<void>;

  setAccountScores(accountIds: bigint[], date: Date): Promise<void>;
}
