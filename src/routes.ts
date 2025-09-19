import { Router, Request, Response, NextFunction } from "express";
import {
  CampaignController,
  AdGroupController,
  AccountController,
} from "./controllers/index.js";
import { TYPES } from "./types/index.js";
import { Database } from "./database/index.js";
import { sendResponse } from "./utils/index.js";
import { ApiError } from "./errors/api.error.js";
import { container } from "./container/container.js";
import { keywordRouter } from "./routes/index.js";

const router = Router();

const accCtrl = container.get<AccountController>(TYPES.AccountController);
const cmpgnCtrl = container.get<CampaignController>(TYPES.CampaignController);
const adgrpCtrl = container.get<AdGroupController>(TYPES.AdGroupController);

router.use("/keywords", keywordRouter);

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
  })
  .get("/account", accCtrl.getAll)
  .get("/campaign/:id", cmpgnCtrl.getCampaignsByAccount)
  .get("/campaign/count", cmpgnCtrl.getCampaignCount)
  .get("/adgroup/:id", adgrpCtrl.getAdGroupsByCampaign)
  .get("/adgroup/:id/count", adgrpCtrl.getAdGroupCount)
  .post("/account", accCtrl.create)
  .post("/campaign", cmpgnCtrl.upsert)
  .post("/adgroup", adgrpCtrl.upsert);

export default router;
