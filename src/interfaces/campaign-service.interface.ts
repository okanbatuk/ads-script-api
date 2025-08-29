import type { CampaignDto } from "../dtos";
import type { Campaign } from "../models/prisma";

export interface ICampaignService {
  getAll(): Promise<Campaign[]>;
  upsert(rows: CampaignDto[]): Promise<void>;
}
