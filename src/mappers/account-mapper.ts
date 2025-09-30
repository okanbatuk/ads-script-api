import { type Account, Prisma } from "@prisma/client";
import { AccountScoreMapper } from "./account-score.mapper.js";

import type { AccountDto } from "../dtos/index.js";

type RowAccount =
  | Account
  | Prisma.AccountGetPayload<{ include: { scores: true; children: true } }>;

export class AccountMapper {
  static toDto(row: RowAccount): AccountDto {
    return {
      id: row.id.toString(),
      accountId: row.accountId,
      name: row.name,
      status: row.status,
      parentId: row.parentId ?? undefined,
      children: "children" in row ? this.toDtos(row.children) : [],
      scores: "scores" in row ? AccountScoreMapper.toDtos(row.scores) : [],
    };
  }

  static toDtos(rows: RowAccount[]): AccountDto[] {
    return rows.map((r) => this.toDto(r));
  }
}
