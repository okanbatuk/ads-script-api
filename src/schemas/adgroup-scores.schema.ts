import { z } from "zod";

export const adGroupScoresSchema = z.object({
  adGroupIds: z
    .array(z.coerce.bigint())
    .nonempty("Adgroup Ids array cannot be empty"),
  date: z
    .string()
    .transform((str) => new Date(str))
    .refine((d) => !isNaN(d.getTime()), {
      message: "Invalid date string",
    }),
});

export type AdGroupScoresSchema = z.infer<typeof adGroupScoresSchema>;
