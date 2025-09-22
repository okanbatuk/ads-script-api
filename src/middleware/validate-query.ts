import { Request, Response, NextFunction } from "express";
import { daysQuerySchema } from "../schemas/index.js";

export const validateQuery = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  try {
    req.validatedQuery = daysQuerySchema.parse(req.query);
    next();
  } catch (err) {
    next(err);
  }
};
