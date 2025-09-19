import { KeywordUpsertDto } from "../schemas/index.js";
import type { KeywordDto, KeywordScoreDto } from "../dtos/index.js";

export interface IKeywordService {
  getKeywordScores(
    id: number,
    days: number,
  ): Promise<{
    scores: KeywordScoreDto[];
    total: number;
  }>;

  getBulkKeywordScores(
    ids: number[],
    days: number,
  ): Promise<{
    scores: KeywordScoreDto[];
    total: number;
  }>;

  getByKeywordId(id: number): Promise<KeywordDto | null>;

  upsertKeywords(items: KeywordUpsertDto[]): Promise<void>;

  setKeywordScores(
    scores: {
      keywordId: number;
      date: Date;
      qs: number;
    }[],
  ): Promise<void>;
}
