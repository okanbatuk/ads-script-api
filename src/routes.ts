import { Router, Request, Response, NextFunction } from "express";
import { Database } from "./database/index.js";
import { sendResponse } from "./utils/index.js";
import { ApiError } from "./errors/api.error.js";
import {
  accountRouter,
  adGroupRouter,
  campaignRouter,
  globalScoreRouter,
  keywordRouter,
} from "./routes/index.js";

const router = Router();

router.use("/keywords", keywordRouter);
router.use("/adgroups", adGroupRouter);
router.use("/campaigns", campaignRouter);
router.use("/accounts", accountRouter);
router.use("/global", globalScoreRouter);

router
  .get("/error", async (_req: Request, _res: Response, next: NextFunction) => {
    try {
      throw new ApiError("This is an test error", 400);
    } catch (error) {
      next(error);
    }
  })
  .get("/health", async (req: Request, res: Response): Promise<Response> => {
    const isHealthy = await Database.healthCheck();

    return isHealthy
      ? sendResponse(res, 200, undefined, "Database connection established!")
      : sendResponse(res, 503, undefined, "Failed!");
  });

export default router;
