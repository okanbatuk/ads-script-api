import { ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../errors/api.error";
import { sendResponse } from "./send-response";

export const errorHandler = (
  err: Error | ApiError | ZodError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let errors = [];

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = `Validation failed.`;
  } else if (err instanceof Error) {
    message = err.message;
  }

  errors.push(err.stack ? err.stack : err.message);
  console.error("[ERROR]", err);

  return sendResponse(res, statusCode, undefined, message, errors);
};
