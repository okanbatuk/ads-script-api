import { z } from "zod";

export const accountScoresSchema = z.object({
  accountIds: z
    .array(z.coerce.number())
    .nonempty("Account Ids array cannot be empty"),
  date: z
    .string()
    .transform((str) => new Date(str))
    .refine((d) => !isNaN(d.getTime()), {
      message: "Invalid date string",
    }),
});

export type AccountScoresSchema = z.infer<typeof accountScoresSchema>;
