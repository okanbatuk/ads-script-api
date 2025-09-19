import { Request } from "express";
import { DaysQueryDto } from "../schemas/index.js";

declare global {
  type ValidatedRequest<
    Params = Record<string, any>,
    Query = Record<string, any>,
    Body = any,
  > = Request<any, any, Body, any> & {
    validatedParams: Params;
    validatedQuery: Query;
  };

  type IdOnlyRequest<T> = ValidatedRequest<T, {}>;
  type DaysOnlyRequest = ValidatedRequest<{}, DaysQueryDto>;
  type BodyOnlyRequest<T> = ValidatedRequest<{}, {}, T>;
  type IdAndDaysRequest<T> = ValidatedRequest<T, DaysQueryDto>;
  type DaysAndBodyRequest<T> = ValidatedRequest<{}, DaysQueryDto, T>;
}
