import { z } from "zod";

export const keywordBulkSchema = z.object({
  ids: z.array(z.coerce.number()).nonempty("ids array cannot be empty"),
});

export type KeywordBulkDto = z.infer<typeof keywordBulkSchema>;
