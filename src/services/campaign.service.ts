import { inject, injectable } from "inversify";
import { TYPES } from "../types/index.js";
import { ApiError } from "../errors/api.error.js";
import type { CampaignDto } from "../dtos/index.js";
import type { ICampaignService } from "../interfaces/index.js";
import { type Campaign, PrismaClient, type Status } from "../models/prisma.js";

@injectable()
export class CampaignService implements ICampaignService {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient,
  ) {}

  getAll = async (): Promise<Campaign[]> => {
    return this.prisma.campaign.findMany();
  };
  upsert = async (rows: CampaignDto[]): Promise<void> => {
    console.log(`Campaign Rows:`);
    console.log(rows);
    if (!Array.isArray(rows)) throw new ApiError("Campaigns must be an array.");
    const campaigns: Campaign[] = rows.map((r: CampaignDto) => ({
      id: BigInt(r.id),
      name: r.name,
      status: r.status.toUpperCase() as Status,
    }));
    await this.prisma.$transaction(
      campaigns.map(({ id, name, status }) =>
        this.prisma.campaign.upsert({
          where: { id },
          update: { name, status },
          create: { id, name, status },
        }),
      ),
    );
  };
}
