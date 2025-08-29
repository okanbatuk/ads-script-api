import type { CampaignDto } from "../dtos/index.js";
import type { Campaign } from "../models/prisma.js";

export interface ICampaignService {
  getAll(): Promise<Campaign[]>;
  upsert(rows: CampaignDto[]): Promise<void>;
}
