import { z } from "zod";

export const campaignScoresSchema = z.object({
  campaignIds: z
    .array(z.coerce.bigint())
    .nonempty("Campaign Ids array cannot be empty"),
  date: z
    .string()
    .transform((str) => new Date(str))
    .refine((d) => !isNaN(d.getTime()), {
      message: "Invalid date string",
    }),
});

export type CampaignScoresSchema = z.infer<typeof campaignScoresSchema>;
