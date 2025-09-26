import { Request } from "express";
import type { DaysQueryDto } from "../schemas/index.js";

declare global {
  type GetGlobalTrend = Request<unknown, unknown, unknown, DaysQueryDto>;
  type GetScoresRequest<TParams, TParse> = Request<
    TParams,
    unknown,
    unknown,
    DaysQueryDto
  > & {
    validatedParams: TParse;
  };

  type GetByIdRequest<TParams, TParse> = Request<TParams> & {
    validatedParams: TParse;
  };

  type UpsertRequest<TBody, TParse> = Request<unknown, unknown, TBody> & {
    validatedBody: TParse;
  };
  type SetScoresRequest<TBody, TParse> = Request<unknown, unknown, TBody> & {
    validatedBody: TParse;
  };
  type GetBulkScoresRequest<TBody, TParse> = Request<
    unknown,
    unknown,
    TBody,
    DaysQueryDto
  > & {
    validatedBody: TParse;
  };
}
