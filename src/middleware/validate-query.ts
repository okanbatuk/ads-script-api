import { Request, Response, NextFunction } from "express";
import { DaysQueryDto, daysQuerySchema } from "../schemas/index.js";

export const validateQuery = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  try {
    req.validatedQuery = daysQuerySchema.parse(req.query) as DaysQueryDto;
    next();
  } catch (err) {
    next(err);
  }
};
