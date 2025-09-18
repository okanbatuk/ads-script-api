import { AccountScore } from "@prisma/client";
import { AccountScoreDto } from "../dtos/index.js";
import { formatDate } from "../utils/index.js";

export class AccountScoreMapper {
  static toDto(row: AccountScore): AccountScoreDto {
    return {
      id: row.id,
      qs: row.qs,
      date: formatDate(row.date),
      campaignCount: row.campaignCount,
      accountId: Number(row.accountId),
    };
  }

  static toDtos(rows: AccountScore[]): AccountScoreDto[] {
    return rows.map((r) => this.toDto(r));
  }
}
