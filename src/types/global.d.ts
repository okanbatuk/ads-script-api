import { Request } from "express";
import type { DaysQueryDto } from "../schemas/index.js";

declare global {
  type GetGlobalTrend = Request<unknown, unknown, unknown, DaysQueryDto>;
  type GetScoresRequest<TParams> = Request<
    TParams,
    unknown,
    unknown,
    DaysQueryDto
  > & {
    validatedParams: TParams;
  };

  type GetByIdRequest<TParams> = Request<TParams> & {
    validatedParams: TParams;
  };

  type UpsertRequest<TBody> = Request<unknown, unknown, TBody[]>;
  type SetScoresRequest<TBody> = Request<unknown, unknown, TBody>;
  type GetBulkScoresRequest<TBody> = Request<
    unknown,
    unknown,
    TBody,
    DaysQueryDto
  >;
}
