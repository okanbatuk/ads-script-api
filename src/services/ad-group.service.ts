import { inject, injectable } from "inversify";
import { TYPES } from "../types/index.js";
import type { AdGroupDto } from "../dtos/index.js";
import type { IAdGroupService } from "../interfaces/index.js";
import { type AdGroup, PrismaClient, type Status } from "../models/prisma.js";

@injectable()
export class AdGroupService implements IAdGroupService {
  constructor(
    @inject(TYPES.PrismaClient) private readonly prisma: PrismaClient,
  ) {}

  getAll = async (id: string): Promise<AdGroup[]> => {
    const campaignId = BigInt(id);
    return this.prisma.adGroup.findMany({
      where: { campaignId },
      orderBy: { name: "asc" },
    });
  };

  upsert = async (rows: AdGroupDto[]): Promise<void> => {
    const adGroups: AdGroup[] = rows.map((r: AdGroupDto) => ({
      id: BigInt(r.id),
      name: r.name,
      campaignId: BigInt(r.campaignId),
      status: r.status.toUpperCase() as Status,
    }));
    await this.prisma.$transaction(
      adGroups.map(({ id, name, status, campaignId }) =>
        this.prisma.adGroup.upsert({
          where: { id },
          update: { name, status, campaignId },
          create: { id, name, status, campaignId },
        }),
      ),
    );
  };
}
