import { z } from "zod";

export const keywordBulkBodySchema = z.object({
  ids: z.array(z.coerce.number()).nonempty("ids array cannot be empty"),
});

export type KeywordBulkBodyDto = z.infer<typeof keywordBulkBodySchema>;
