import type { GlobalScoreDto } from "../dtos/index.js";

export interface IGlobalScoreService {
  getGlobalTrend(days: number): Promise<GlobalScoreDto[]>;
  setGlobalScore(date: Date): Promise<void>;
}
