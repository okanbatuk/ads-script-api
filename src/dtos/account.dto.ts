import { AccountScoreDto } from "./account-score.dto";

export type AccountDto = {
  readonly id: string;
  readonly name: string;
  readonly status: string;
  readonly scores: AccountScoreDto[];
};
