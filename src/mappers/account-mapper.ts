import { type Account, Prisma } from "@prisma/client";
import { AccountScoreMapper } from "./account-score.mapper.js";

import type { AccountDto } from "../dtos/index.js";

type RowAccount =
  | Account
  | Prisma.AccountGetPayload<{ include: { scores: true } }>;

export class AccountMapper {
  static toDto(row: RowAccount): AccountDto {
    return {
      id: row.id.toString(),
      accountId: row.accountId,
      name: row.name,
      status: row.status,
      scores:
        "scores" in row ? AccountScoreMapper.toDtos(row.scores) : undefined,
    };
  }
}
