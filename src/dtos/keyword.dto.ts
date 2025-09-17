import { KeywordScoreDto } from "./keyword-score.dto";

export type KeywordDto = {
  readonly id: number;
  readonly criterionId: string;
  readonly keyword: string;
  readonly adGroupId: string;
  readonly scores?: KeywordScoreDto[];
};
