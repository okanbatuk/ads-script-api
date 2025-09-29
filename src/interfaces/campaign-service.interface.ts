import type { CampaignUpsertSchema } from "../schemas/campaign-upsert.schema.js";
import type {
  AdGroupDto,
  CampaignDto,
  CampaignScoreDto,
} from "../dtos/index.js";

export interface ICampaignService {
  getAdGroups(
    campaignId: bigint,
  ): Promise<{ adGroups: AdGroupDto[]; total: number }>;
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

  upsertCampaigns(items: CampaignUpsertSchema[]): Promise<void>;

  setCampaignScores(campaignIds: bigint[], date: Date): Promise<void>;
}
