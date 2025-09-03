import type { KeywordDto } from "../dtos/index.js";
import type { Keyword } from "../models/prisma.js";

export interface IKeywordService {
  getAll(id: string): Promise<Keyword[]>;
  getLastDate(id: string): Promise<Date | null>;
  upsert(rows: KeywordDto[]): Promise<void>;
}
