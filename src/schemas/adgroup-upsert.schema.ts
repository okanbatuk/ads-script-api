import { z } from "zod";

export const adGroupUpsertSchema = z.object({
  id: z.string().regex(/^\d+$/, "AdGroupId must be numeric").transform(BigInt),
  name: z.string().min(1, "Name cannot be empty"),
  campaignId: z
    .string()
    .regex(/^\d+$/, "CampaignId must be numeric")
    .transform(BigInt),
  status: z.string(),
});

export type AdGroupUpsertDto = z.infer<typeof adGroupUpsertSchema>;
