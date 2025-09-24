import { z } from "zod";
import { Request, Response, NextFunction } from "express";

export const validateBody =
  <T extends z.ZodTypeAny>(schema: z.ZodType) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      (req as any).validatedBody = schema.parse(req.body) as z.infer<T>;
      next();
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
