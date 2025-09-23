import { formatDate } from "../utils/index.js";

import type { KeywordScore } from "@prisma/client";
import type { KeywordScoreDto } from "../dtos/index.js";

export class KeywordScoreMapper {
  static toDto(row: KeywordScore): KeywordScoreDto {
    return {
      id: row.id,
      keywordId: row.keywordId,
      date: formatDate(row.date),
      qs: row.qs,
    };
  }

  static toDtos(rows: KeywordScore[]): KeywordScoreDto[] {
    return rows.map((r) => this.toDto(r));
  }
}
