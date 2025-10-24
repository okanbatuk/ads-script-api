import { AccountScoreDto } from "./account-score.dto";

export type AccountDto = {
  readonly id: string;
  readonly accountId: string;
  readonly name: string;
  readonly type: boolean;
  readonly status: string;
  readonly parentId?: number;
  readonly children: AccountDto[];
  readonly scores: AccountScoreDto[];
};
