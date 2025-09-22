import { z } from "zod";

export const accountUpsertSchema = z
  .object({
    id: z.coerce.bigint(),
    name: z.string().min(1, "Name can not be null"),
    status: z.string().min(1, "Status can not be null"),
  })
  .readonly();

export type AccountUpsertDto = z.infer<typeof accountUpsertSchema>;
