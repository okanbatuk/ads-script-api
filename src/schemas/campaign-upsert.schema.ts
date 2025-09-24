import { z } from "zod";

export const campaignUpsertSchema = z
  .object({
    id: z.coerce.bigint(),
    name: z.string().min(1, "Name can not be null"),
    status: z.string().min(1, "Status can not be null"),
    accountId: z.coerce.bigint(),
  })
  .readonly();

export type CampaignUpsertSchema = z.infer<typeof campaignUpsertSchema>;
