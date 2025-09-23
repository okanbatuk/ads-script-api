import type { AdGroupScore } from "@prisma/client";
import type { AdGroupScoreDto } from "../dtos/index.js";
import { formatDate } from "../utils/index.js";

export class AdGroupScoreMapper {
  static toDto(row: AdGroupScore): AdGroupScoreDto {
    return {
      id: row.id,
      qs: row.qs,
      date: formatDate(row.date),
      adGroupId: row.adGroupId.toString(),
      keywordCount: row.keywordCount,
    };
  }
  static toDtos(rows: AdGroupScore[]): AdGroupScoreDto[] {
    return rows.map((r) => this.toDto(r));
  }
}
