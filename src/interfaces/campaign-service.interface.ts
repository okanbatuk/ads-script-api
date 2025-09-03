import type { CampaignDto } from "../dtos/index.js";
import type { Campaign } from "../models/prisma.js";

export interface ICampaignService {
  getAll(): Promise<Campaign[]>;
  getCount(): Promise<number>;
  upsert(rows: CampaignDto[]): Promise<void>;
}
