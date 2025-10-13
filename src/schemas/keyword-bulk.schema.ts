import { z } from "zod";

const keywordPairSchema = z.object({
  criterionId: z.coerce.bigint(),
  adGroupId: z.coerce.bigint(),
});

// bulk body
export const keywordBulkDtoSchema = z
  .object({
    pairs: z.array(keywordPairSchema).min(1).max(200),
  })
  .strict();

export type KeywordBulkSchema = z.infer<typeof keywordBulkDtoSchema>;
