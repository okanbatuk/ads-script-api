import { AdGroup, Prisma } from "@prisma/client";
import { AdGroupDto } from "../dtos/index.js";
import { AdGroupScoreMapper } from "./adgroup-score.mapper.js";

type RowAdGroup =
  | AdGroup
  | Prisma.AdGroupGetPayload<{ include: { scores: true } }>;

export class AdGroupMapper {
  static toDto(row: RowAdGroup): AdGroupDto {
    return {
      id: row.id.toString(),
      name: row.name,
      status: row.status,
      campaignId: row.campaignId.toString(),
      scores:
        "scores" in row ? AdGroupScoreMapper.toDtos(row.scores) : undefined,
    };
  }
}
