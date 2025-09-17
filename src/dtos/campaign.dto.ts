import { CampaignScoreDto } from "./campaign-score.dto";

export type CampaignDto = {
  readonly id: string;
  readonly name: string;
  readonly status: string;
  readonly accountId: string;
  readonly scores: CampaignScoreDto[];
};
