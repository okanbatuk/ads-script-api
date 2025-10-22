import type { GlobalScoreDto } from "../dtos/index.js";

export interface IGlobalScoreService {
  getGlobalTrend(
    mccId: number,
    days: number,
  ): Promise<{ scores: GlobalScoreDto[] }>;
  setGlobalScore(mccId: number, date: Date): Promise<void>;
}
