import type { AdGroupDto, AdGroupScoreDto } from "../dtos";

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

  upsertAdGroups(items: AdGroupDto[]): Promise<void>;

  setAdGroupScores(adGroupIds: bigint[], date: Date): Promise<void>;
}
