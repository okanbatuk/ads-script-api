import { z } from "zod";

export const bigIntIdParamSchema = z.object({
  id: z.coerce.bigint().refine((n) => n > 0n, {
    message: "Id must be a positive bigint",
  }),
});

export type BigIntIdParamDto = z.infer<typeof bigIntIdParamSchema>;

export const intIdParamSchema = z.object({
  id: z.coerce
    .number()
    .int()
    .positive()
    .refine((n) => n > 0n, {
      message: "Id must be a positive int",
    }),
});

export type IntIdParamDto = z.infer<typeof intIdParamSchema>;
