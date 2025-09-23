import { formatDate } from "../utils/index.js";

import type { CampaignScore } from "@prisma/client";
import type { CampaignScoreDto } from "../dtos/index.js";

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
