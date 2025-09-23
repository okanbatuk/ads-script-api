import type { AdGroupUpsertDto } from "../schemas/index.js";
import type { AdGroupDto, AdGroupScoreDto } from "../dtos/index.js";

export interface IAdGroupService {
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

  upsert(items: AdGroupUpsertDto[]): Promise<void>;

  setAdGroupScores(adGroupIds: bigint[], date: Date): Promise<void>;
}
