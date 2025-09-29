import type { AdGroupUpsertSchema } from "../schemas/adgroup-upsert.schema.js";
import type { AdGroupDto, AdGroupScoreDto, KeywordDto } from "../dtos/index.js";

export interface IAdGroupService {
  getAllKeywords(
    adGroupId: bigint,
    include: boolean,
  ): Promise<{ keywords: KeywordDto[]; total: number }>;
  getAdGroupScores(
    adGroupId: bigint,
    days: number,
  ): Promise<{
    scores: AdGroupScoreDto[];
    total: number;
  }>;

  getBulkAdGroupScores(
    adGroupIds: bigint[],
    days: number,
  ): Promise<{
    scores: AdGroupScoreDto[];
    total: number;
  }>;

  getById(adGroupId: bigint): Promise<AdGroupDto | null>;

  upsert(items: AdGroupUpsertSchema[]): Promise<void>;

  setAdGroupScores(adGroupIds: bigint[], date: Date): Promise<void>;
}
