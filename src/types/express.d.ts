import type { IdParamDto, DaysQueryDto } from "../schemas/index.js";

declare global {
  namespace Express {
    interface Request {
      validatedParams?: unknown;
      validatedQuery?: DaysQueryDto;
    }
  }
}
