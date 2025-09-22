import { z } from "zod";
import { Request, Response, NextFunction } from "express";

export const validateParams =
  <T extends z.ZodTypeAny>(schema: T) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req.params) as z.infer<T>;
      (req as any).validatedParams = parsed;
      next();
    } catch (err) {
      next(err);
    }
  };
