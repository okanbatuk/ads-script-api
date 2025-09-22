import { z } from "zod";

export const accountScoresSchema = z.object({
  accountIds: z
    .array(z.coerce.bigint())
    .nonempty("Account Ids array cannot be empty"),
  date: z
    .string()
    .transform((str) => new Date(str))
    .refine((d) => !isNaN(d.getTime()), {
      message: "Invalid date string",
    }),
});

export type AccountScoresDto = z.infer<typeof accountScoresSchema>;
