import type {
  KeywordDto,
  KeywordFilter,
  Pagination,
  ResponseDateDto,
} from "../dtos/index.js";
import type { Keyword } from "../models/prisma.js";

export interface IKeywordService {
  getKeywordsByFilter(
    filter: KeywordFilter,
    // sort: SortDto | undefined,
    pagination: Pagination,
  ): Promise<{
    keywords: {
      id: number;
      keyword: string;
      avgQs: number;
    }[];
    total: number;
    page: number;
    limit: number;
  }>;
  getDate(id: string): Promise<ResponseDateDto>;
  upsert(rows: KeywordDto[]): Promise<void>;
  delete(id: string): Promise<void>;
}
