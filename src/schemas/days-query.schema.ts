import { z } from "zod";

export const daysQuerySchema = z.object({
  days: z.coerce
    .number()
    .int()
    .positive()
    .refine((n) => n > 0, { message: "days must be > 0" })
    .default(7),
});

export type DaysQueryDto = z.infer<typeof daysQuerySchema>;
