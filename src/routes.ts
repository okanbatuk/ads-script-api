import { Router, Request, Response } from "express";
import {
  CampaignController,
  AdGroupController,
  KeywordController,
} from "./controllers";
import { container } from "./container/container";
import { TYPES } from "./types";
import { sendResponse } from "./utils/send-response";
import { Database } from "./database";

const router = Router();

const cmpgnCtrl = container.get<CampaignController>(TYPES.CampaignController);
const adgrpCtrl = container.get<AdGroupController>(TYPES.AdGroupController);
const kwCtrl = container.get<KeywordController>(TYPES.KeywordController);

router
  .all("/", (req: Request, res: Response) => {
    return sendResponse(res, 200, undefined, "Ads API working on Vercel!");
  })
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
