import type { KeywordUpsertSchema } from "../schemas/keyword-upsert.schema.js";
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

  upsertKeywords(items: KeywordUpsertSchema[]): Promise<void>;

  setKeywordScores(
    scores: {
      keywordId: number;
      date: Date;
      qs: number;
    }[],
  ): Promise<void>;
}
