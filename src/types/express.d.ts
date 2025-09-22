import type { DaysQueryDto } from "../schemas/index.js";

declare module "express-serve-static-core" {
  interface Request {
    validatedQuery: DaysQueryDto;
  }
}
