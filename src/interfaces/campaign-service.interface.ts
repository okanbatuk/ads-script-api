import type { CampaignUpsertDto } from "../schemas/index.js";
import type { CampaignDto, CampaignScoreDto } from "../dtos/index.js";

export interface ICampaignService {
  getCampaignScores(
    campaignId: bigint,
    days: number,
  ): Promise<{
    scores: CampaignScoreDto[];
    total: number;
  }>;

  getBulkCampaignScores(
    campaignIds: bigint[],
    days: number,
  ): Promise<{
    scores: CampaignScoreDto[];
    total: number;
  }>;

  getById(campaignId: bigint): Promise<CampaignDto | null>;

  upsertCampaigns(items: CampaignUpsertDto[]): Promise<void>;

  setCampaignScores(campaignIds: bigint[], date: Date): Promise<void>;
}
