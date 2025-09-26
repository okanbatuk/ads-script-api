import { z } from "zod";

export const keywordScoresSchema = z.array(
  z.object({
    keywordId: z.coerce.bigint(),
    date: z
      .string()
      .transform((str) => new Date(str))
      .refine((d) => !isNaN(d.getTime()), {
        message: `Invalid date string`,
      }),
    qs: z.coerce.number(),
    adGroupId: z.coerce.bigint(),
  }),
);

export type KeywordSetScoreSchema = z.infer<typeof keywordScoresSchema>;
