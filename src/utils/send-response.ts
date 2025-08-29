import { Response } from "express";
import { ApiResponse } from "../types";

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  data?: T,
  message?: string,
  errors?: string[],
): Response => {
  const payload: ApiResponse<T> = {
    success: statusCode < 400,
    statusCode,
    data,
    message,
    errors,
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(payload);
};
