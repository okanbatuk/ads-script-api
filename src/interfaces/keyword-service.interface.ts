import type {
  KeywordDto,
  KeywordFilter,
  Pagination,
  SortDto,
} from "../dtos/index.js";
import type { Keyword } from "../models/prisma.js";

export interface IKeywordService {
  getKeywordsByFilter(
    filter: KeywordFilter,
    sort: SortDto | undefined,
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
  getLastDate(id: string): Promise<Date | null>;
  upsert(rows: KeywordDto[]): Promise<void>;
}
