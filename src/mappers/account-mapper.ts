import { Account, Prisma } from "@prisma/client";
import { AccountDto } from "../dtos/index.js";
import { AccountScoreMapper } from "./account-score.mapper.js";

type RowAccount =
  | Account
  | Prisma.AccountGetPayload<{ include: { scores: true } }>;

export class AccountMapper {
  static toDto(row: RowAccount): AccountDto {
    return {
      id: row.id.toString(),
      name: row.name,
      status: row.status,
      scores:
        "scores" in row ? AccountScoreMapper.toDtos(row.scores) : undefined,
    };
  }
}
