import { z } from "zod";

export const adGroupBulkBodySchema = z.object({
  ids: z.array(z.coerce.bigint()).nonempty("ids array cannot be empty"),
});

export type AdGroupBulkBodyDto = z.infer<typeof adGroupBulkBodySchema>;
