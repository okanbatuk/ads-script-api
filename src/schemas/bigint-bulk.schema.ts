import { z } from "zod";

export const bigIntBulkSchema = z.object({
  ids: z.array(z.coerce.bigint()).nonempty("ids array cannot be empty"),
});

export type BigIntBulkDto = z.infer<typeof bigIntBulkSchema>;
