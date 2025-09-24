import { z } from "zod";

export const adGroupUpsertSchema = z.object({
  id: z.coerce.bigint(),
  name: z.string().min(1, "Name cannot be empty"),
  campaignId: z.coerce.bigint(),
  status: z.string(),
});

export type AdGroupUpsertSchema = z.infer<typeof adGroupUpsertSchema>;
