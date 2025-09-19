import { z } from "zod";

export const keywordUpsertSchema = z.object({
  criterionId: z
    .string()
    .regex(/^\d+$/, "CriterionId must be numeric")
    .transform(BigInt),
  keyword: z.string().min(1, "Keyword cannot be empty"),
  status: z.string().min(1, "Status cannot be empty"),
  adGroupId: z
    .string()
    .regex(/^\d+$/, "AdGroupId must be numeric")
    .transform(BigInt),
});

export type KeywordUpsertDto = z.infer<typeof keywordUpsertSchema>;
