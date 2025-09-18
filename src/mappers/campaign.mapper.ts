import { Campaign, Prisma } from "@prisma/client";
import { CampaignDto } from "src/dtos";
import { CampaignScoreMapper } from "./campaign-score.mapper";

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
