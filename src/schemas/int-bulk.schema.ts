import { z } from "zod";

export const intBulkSchema = z.object({
  ids: z.array(z.coerce.number()).nonempty("ids array cannot be empty"),
});

export type IntBulkDto = z.infer<typeof intBulkSchema>;
