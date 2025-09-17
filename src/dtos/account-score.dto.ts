export interface AccountScoreDto {
  readonly id: number;
  readonly accountId: number;
  readonly date: string;
  readonly qs: number;
  readonly campaignCount: number;
}
