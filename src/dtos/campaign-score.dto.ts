export interface CampaignScoreDto {
  readonly id: number;
  readonly campaignId: number;
  readonly date: string;
  readonly qs: number;
  readonly adGroupCount: number;
}
