import type { AdGroupDto } from "../dtos/index.js";
import type { AdGroup } from "../models/prisma.js";

export interface IAdGroupService {
  getAll(id: string): Promise<AdGroup[]>;
  upsert(rows: AdGroupDto[]): Promise<void>;
}
