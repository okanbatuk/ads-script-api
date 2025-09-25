import { AccountScoreDto } from "./account-score.dto";

export type AccountDto = {
  readonly accountId: string;
  readonly name: string;
  readonly status: string;
  readonly scores: AccountScoreDto[] | undefined;
};
