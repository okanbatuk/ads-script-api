import { AdGroupScoreDto } from "./adgroup-score.dto";

export type AdGroupDto = {
  readonly id: string;
  readonly name: string;
  readonly campaignId: string;
  readonly status: string;
  readonly scores?: AdGroupScoreDto[];
};
