import { inject, injectable } from "inversify";
import { startOfDay, subDays } from "date-fns";
import { TYPES } from "../types/index.js";
import { CampaignMapper, CampaignScoreMapper } from "../mappers/index.js";

import {
  type Campaign,
  type CampaignScore,
  Prisma,
  PrismaClient,
  Status,
} from "../models/prisma.js";
import type { ICampaignService } from "../interfaces/index.js";
import type { CampaignDto, CampaignScoreDto } from "../dtos/index.js";
import type { CampaignUpsertSchema } from "../schemas/index.js";

@injectable()
export class CampaignService implements ICampaignService {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient,
  ) {}

  transform = (row: CampaignUpsertSchema): Campaign => {
    const entries = Object.entries(row).map(([key, value]) => {
      if (key === "status") {
        const upper = (value as string).toUpperCase();
        return Object.values(Status).includes(upper as Status)
          ? [key, upper as Status]
          : [key, Status.UNKNOWN];
      }
      return [key, value];
    });
    return Object.fromEntries(entries);
  };

  async getCampaignScores(
    campaignId: bigint,
    days: number = 7,
  ): Promise<{ scores: CampaignScoreDto[]; total: number }> {
    const where: Prisma.CampaignScoreWhereInput = {
      campaignId,
      date: { gte: startOfDay(subDays(new Date(), days)) },
    };

    const [rows, total] = await Promise.all([
      this.prisma.campaignScore.findMany({ where, orderBy: { date: "desc" } }),
      this.prisma.campaignScore.count({ where }),
    ]);

    return { scores: CampaignScoreMapper.toDtos(rows), total };
  }

  async getBulkCampaignScores(
    campaignIds: bigint[],
    days: number = 7,
  ): Promise<{ scores: CampaignScoreDto[]; total: number }> {
    const where: Prisma.CampaignScoreWhereInput = {
      campaignId: { in: campaignIds },
      date: { gte: startOfDay(subDays(new Date(), days)) },
    };
    const [rows, total] = await Promise.all([
      this.prisma.campaignScore.findMany({ where, orderBy: { date: "desc" } }),
      this.prisma.campaign.count(),
    ]);
    return { scores: CampaignScoreMapper.toDtos(rows), total };
  }

  async getById(campaignId: bigint): Promise<CampaignDto | null> {
    const row = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
    });
    return row ? CampaignMapper.toDto(row) : null;
  }

  async upsertCampaigns(items: CampaignUpsertSchema[]): Promise<void> {
    const data = items.map((i) => this.transform(i));

    await this.prisma.$transaction(async (tx) => {
      for (let row of data) {
        await tx.campaign.upsert({
          where: { id: row.id },
          update: {
            name: row.name,
            status: row.status,
            accountId: row.accountId,
          },
          create: row,
        });
      }
    });
  }
  async setCampaignScores(campaignIds: bigint[], date: Date): Promise<void> {
    const rows = await this.prisma.adGroup.findMany({
      where: { campaignId: { in: campaignIds } },
      include: {
        scores: {
          where: { date },
          select: { qs: true },
        },
      },
    });

    const map = new Map<
      bigint,
      {
        qsSum: number;
        count: number;
      }
    >();

    for (let ag of rows) {
      if (ag.scores.length === 0) continue;
      const key = ag.campaignId;
      const curr = map.get(key) ?? { qsSum: 0, count: 0 };
      for (let sc of ag.scores) {
        curr.qsSum += sc.qs;
        curr.count += 1;
      }
      map.set(key, curr);
    }

    const data: Omit<CampaignScore, "id">[] = Array.from(map.entries()).map(
      ([campaignId, v]) => ({
        campaignId,
        date,
        qs: v.count ? v.qsSum / v.count : 0,
        adGroupCount: v.count,
      }),
    );

    if (data.length) {
      const campaignIds = data.map((d) => d.campaignId);
      const dates = data.map((d) => d.date);
      const qsArr = data.map((d) => d.qs);
      const counts = data.map((d) => d.adGroupCount);

      await this.prisma.$executeRaw`
        INSERT INTO campaign_score (campaign_id, date, qs, ad_group_count)
        SELECT * FROM UNNEST(
          ${campaignIds}::bigint[],
          ${dates}::date[],
          ${qsArr}::float[],
          ${counts}::int[]
        ) AS t(campaign_id, date, qs, ad_group_count)
        ON CONFLICT (campaign_id, date)
        DO UPDATE SET
          qs = EXCLUDED.qs,
          ad_group_count = EXCLUDED.ad_group_count`;
    }
  }
}
