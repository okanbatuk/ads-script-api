import { z } from "zod";

export const accountUpsertSchema = z
  .object({
    accountId: z.string().min(1, "Account id cannot be null"),
    name: z.string().min(1, "Name can not be null"),
    status: z.string().min(1, "Status can not be null"),
    type: z.boolean(),
    parentId: z.coerce.number().optional(),
  })
  .readonly();

export type AccountUpsertSchema = z.infer<typeof accountUpsertSchema>;
