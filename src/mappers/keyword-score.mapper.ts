import { KeywordScore } from "@prisma/client";
import { KeywordScoreDto } from "../dtos/index.js";
import { formatDate } from "../utils/index.js";

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
