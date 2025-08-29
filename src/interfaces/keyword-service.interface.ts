import type { KeywordDto } from "../dtos";
import type { Keyword } from "../models/prisma";

export interface IKeywordService {
  getAll(id: string): Promise<Keyword[]>;
  upsert(rows: KeywordDto[]): Promise<void>;
}
