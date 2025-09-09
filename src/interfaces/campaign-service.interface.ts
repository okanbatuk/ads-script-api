import type { CampaignDto } from "../dtos/index.js";
import type { Campaign } from "../models/prisma.js";

export interface ICampaignService {
  getAll(id: string): Promise<Campaign[]>;
  getCount(id: string): Promise<number>;
  upsert(rows: CampaignDto[]): Promise<void>;
}
