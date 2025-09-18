import { CampaignScore } from "@prisma/client";
import { CampaignScoreDto } from "../dtos/index.js";
import { formatDate } from "../utils/index.js";

export class CampaignScoreMapper {
  static toDto(row: CampaignScore): CampaignScoreDto {
    return {
      id: row.id,
      qs: row.qs,
      date: formatDate(row.date),
      adGroupCount: row.adGroupCount,
      campaignId: Number(row.campaignId),
    };
  }

  static toDtos(rows: CampaignScore[]): CampaignScoreDto[] {
    return rows.map((r) => this.toDto(r));
  }
}
