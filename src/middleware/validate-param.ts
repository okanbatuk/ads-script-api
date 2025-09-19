import { z } from "zod";
import { Request, Response, NextFunction } from "express";

export const validateParams =
  <T extends z.ZodTypeAny>(schema: T) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.validatedParams = schema.parse(req.params) as z.infer<T>;
      next();
    } catch (err) {
      next(err);
    }
  };
