import { formatDate } from "../utils/index.js";

import type { GlobalScore } from "@prisma/client";
import type { GlobalScoreDto } from "../dtos/index.js";

export class GlobalScoreMapper {
  static toDto(row: GlobalScore): GlobalScoreDto {
    return {
      id: row.id,
      qs: row.qs,
      mccId: row.mccId,
      date: formatDate(row.date),
      accountCount: row.accountCount,
    };
  }

  static toDtos(rows: GlobalScore[]): GlobalScoreDto[] {
    return rows.map((r) => this.toDto(r));
  }
}
