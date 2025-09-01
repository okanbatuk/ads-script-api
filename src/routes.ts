import { Router, Request, Response } from "express";
import {
  CampaignController,
  AdGroupController,
  KeywordController,
} from "./controllers/index.js";
import { TYPES } from "./types/index.js";
import { Database } from "./database/index.js";
import { sendResponse } from "./utils/index.js";
import { container } from "./container/container.js";

const router = Router();

const cmpgnCtrl = container.get<CampaignController>(TYPES.CampaignController);
const adgrpCtrl = container.get<AdGroupController>(TYPES.AdGroupController);
const kwCtrl = container.get<KeywordController>(TYPES.KeywordController);

router
  .get("/health", async (req: Request, res: Response): Promise<Response> => {
    const isHealthy = await Database.healthCheck();

    return isHealthy
      ? sendResponse(res, 200, undefined, "Database connection established!")
      : sendResponse(res, 503, undefined, "Failed!");
  })
  .get("/campaign", cmpgnCtrl.getAll)
  .get("/adgroup/:id", adgrpCtrl.getAdGroupsByCampaign)
  .get("/keyword/:id", kwCtrl.getKeywordsByAdGroup)
  .post("/campaign", cmpgnCtrl.upsert)
  .post("/adgroup", adgrpCtrl.upsert)
  .post("/keyword", kwCtrl.upsert);

export default router;
