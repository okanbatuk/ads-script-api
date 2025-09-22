import { z } from "zod";

export const scoreDateSchema = z.object({
  date: z
    .string()
    .transform((str) => new Date(str))
    .refine((d) => !isNaN(d.getTime()), {
      message: "Invalid date string",
    }),
});

export type ScoreDateDto = z.infer<typeof scoreDateSchema>;
