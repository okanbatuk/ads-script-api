import { z } from "zod";

export const keywordUpsertSchema = z.object({
  criterionId: z.coerce.bigint(),
  keyword: z.string().min(1, "Keyword cannot be empty"),
  status: z.string().min(1, "Status cannot be empty"),
  adGroupId: z.coerce.bigint(),
});

export type KeywordUpsertDto = z.infer<typeof keywordUpsertSchema>;
