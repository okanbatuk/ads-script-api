import type { KeywordUpsertSchema } from "../schemas/keyword-upsert.schema.js";
import type { KeywordDto, KeywordScoreDto } from "../dtos/index.js";
import type {
  KeywordBulkSchema,
  KeywordSetScoreSchema,
} from "../schemas/index.js";

export interface IKeywordService {
  getKeywordIds(pairs: KeywordBulkSchema): Promise<KeywordDto[]>;

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

  setKeywordScores(scores: KeywordSetScoreSchema): Promise<void>;
}
