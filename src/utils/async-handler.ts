import { Request, Response, NextFunction } from "express";

export const asyncHandler = <
  P = any,
  ReqBody = any,
  ReqQuery = any,
  ResBody = any,
  Locals extends Record<string, any> = Record<string, any>,
>(
  fn: (
    req: Request<P, ResBody, ReqBody, ReqQuery, Locals>,
    res: Response<ResBody, Locals>,
    next: NextFunction,
  ) => Promise<any>,
) => {
  return (
    req: Request<P, ResBody, ReqBody, ReqQuery, Locals>,
    res: Response<ResBody, Locals>,
    next: NextFunction,
  ) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
