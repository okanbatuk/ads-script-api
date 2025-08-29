import type { AdGroupDto } from "../dtos";
import type { AdGroup } from "../models/prisma";

export interface IAdGroupService {
  getAll(id: string): Promise<AdGroup[]>;
  upsert(rows: AdGroupDto[]): Promise<void>;
}
