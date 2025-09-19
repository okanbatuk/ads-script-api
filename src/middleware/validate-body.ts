import { z } from "zod";
import { Request, Response, NextFunction } from "express";

export const validateBody =
  (schema: z.ZodType) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
