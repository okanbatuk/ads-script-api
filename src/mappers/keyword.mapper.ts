import { Keyword, Prisma } from "@prisma/client";
import { KeywordDto } from "../dtos";
import { KeywordScoreMapper } from "./keyword-score.mapper";

type RowKeyword =
  | Keyword
  | Prisma.KeywordGetPayload<{ include: { scores: true } }>;

export class KeywordMapper {
  static toDto(row: RowKeyword): KeywordDto {
    return {
      id: row.id,
      criterionId: row.criterionId.toString(),
      keyword: row.keyword,
      adGroupId: row.adGroupId.toString(),
      scores:
        "scores" in row ? KeywordScoreMapper.toDtos(row.scores) : undefined,
    };
  }
}
