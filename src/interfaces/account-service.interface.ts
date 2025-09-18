import type { Account } from "../models/prisma.js";
import type { AccountDto, AccountScoreDto } from "../dtos/index.js";

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

  upsertAccounts(items: AccountDto[]): Promise<void>;

  setAccountScores(accountIds: bigint[], date: Date): Promise<void>;
}
