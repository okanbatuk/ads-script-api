import { type Keyword, Prisma } from "@prisma/client";
import { KeywordScoreMapper } from "./keyword-score.mapper.js";

import type { KeywordDto } from "../dtos/index.js";

type RowKeyword =
  | Keyword
  | Prisma.KeywordGetPayload<{ include: { scores: true } }>;

export class KeywordMapper {
  static toDto(row: RowKeyword): KeywordDto {
    return {
      id: row.id,
      criterionId: row.criterionId.toString(),
      keyword: row.keyword,
      status: row.status,
      adGroupId: row.adGroupId.toString(),
      scores:
        "scores" in row ? KeywordScoreMapper.toDtos(row.scores) : undefined,
    };
  }
}
