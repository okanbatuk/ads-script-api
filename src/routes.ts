import { Router, Request, Response } from "express";
import {
  CampaignController,
  AdGroupController,
  KeywordController,
} from "./controllers";
import { container } from "./container/container";
import { TYPES } from "./types";
import { sendResponse } from "./utils/send-response";

const router = Router();

const cmpgnCtrl = container.get<CampaignController>(TYPES.CampaignController);
const adgrpCtrl = container.get<AdGroupController>(TYPES.AdGroupController);
const kwCtrl = container.get<KeywordController>(TYPES.KeywordController);

router
  .all("/", (req: Request, res: Response) => {
    return sendResponse(res, 200, undefined, "Ads API working on Vercel!");
  })
  .get("/campaign", cmpgnCtrl.getAll)
  .get("/adgroup/:id", adgrpCtrl.getAdGroupsByCampaign)
  .get("/keyword/:id", kwCtrl.getKeywordsByAdGroup)
  .post("/campaign", cmpgnCtrl.upsert)
  .post("/adgroup", adgrpCtrl.upsert)
  .post("/keyword", kwCtrl.upsert);
