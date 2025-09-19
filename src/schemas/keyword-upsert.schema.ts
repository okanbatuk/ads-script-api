import { z } from "zod";

export const keywordUpsertSchema = z.array(
  z.object({
    criterionId: z
      .string()
      .regex(/^\d+$/, "CriterionId must be numeric")
      .transform(BigInt),
    keyword: z.string().min(1, "Keyword cannot be empty"),
    adGroupId: z
      .string()
      .regex(/^\d+$/, "AdGroupId must be numeric")
      .transform(BigInt),
  }),
);

export type KeywordUpsertDto = z.infer<typeof keywordUpsertSchema>;
