import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import type { CampaignDto } from "../dtos";
import type { ICampaignService } from "../interfaces";
import { type Campaign, PrismaClient, Status } from "../models/prisma";

@injectable()
export class CampaignService implements ICampaignService {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient,
  ) {}

  getAll = async (): Promise<Campaign[]> => {
    return this.prisma.campaign.findMany();
  };
  upsert = async (rows: CampaignDto[]): Promise<void> => {
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
