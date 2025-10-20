import { z } from "zod";

export const scoreDateSchema = z.object({
  mccId: z.coerce.number(),
  date: z
    .string()
    .transform((str) => new Date(str))
    .refine((d) => !isNaN(d.getTime()), {
      message: "Invalid date string",
    }),
});

export type ScoreDateSchema = z.infer<typeof scoreDateSchema>;
