import { type Campaign, Prisma } from "@prisma/client";
import { CampaignScoreMapper } from "./campaign-score.mapper.js";

import type { CampaignDto } from "../dtos/index.js";

type RowCampaign =
  | Campaign
  | Prisma.CampaignGetPayload<{ include: { scores: true } }>;

export class CampaignMapper {
  static toDto(row: RowCampaign): CampaignDto {
    return {
      id: row.id.toString(),
      name: row.name,
      status: row.status,
      accountId: row.accountId.toString(),
      scores:
        "scores" in row ? CampaignScoreMapper.toDtos(row.scores) : undefined,
    };
  }
}
