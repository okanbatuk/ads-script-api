import { z } from "zod";

export const adGroupBulkSchema = z.object({
  ids: z.array(z.coerce.bigint()).nonempty("ids array cannot be empty"),
});

export type AdGroupBulkDto = z.infer<typeof adGroupBulkSchema>;
