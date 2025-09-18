import { GlobalScore } from "@prisma/client";
import { formatDate } from "../utils/index.js";
import { GlobalScoreDto } from "../dtos/index.js";

export class GlobalScoreMapper {
  static toDto(row: GlobalScore): GlobalScoreDto {
    return {
      id: row.id,
      qs: row.qs,
      date: formatDate(row.date),
      accountCount: row.accountCount,
    };
  }

  static toDtos(rows: GlobalScore[]): GlobalScoreDto[] {
    return rows.map((r) => this.toDto(r));
  }
}
