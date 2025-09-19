import { Router } from "express";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../middleware/index.js";
import {
  bigIntIdParamSchema,
  campaignScoresSchema,
  campaignUpsertSchema,
} from "../schemas/index.js";
import { TYPES } from "../types/index.js";
import { asyncHandler } from "../utils/index.js";
import { CampaignController } from "../controllers/index.js";
import { container } from "../container/container.js";

export const campaignRouter = Router({ mergeParams: true });

const ctrl = container.get<CampaignController>(TYPES.CampaignController);

// GET /api/campaigns/:id/scores?days=7
campaignRouter.get(
  "/:id/scores",
  validateParams(bigIntIdParamSchema),
  validateQuery,
  asyncHandler(ctrl.getScores),
);

// GET /api/campaigns/bulkscores?days=7
campaignRouter.get(
  "/bulkscores",
  validateQuery,
  asyncHandler(ctrl.getBulkScores),
);

// GET /api/campaigns/:id
campaignRouter.get(
  "/:id",
  validateParams(bigIntIdParamSchema),
  asyncHandler(ctrl.getById),
);

// POST /api/campaigns  (upsert)
campaignRouter.post(
  "/",
  validateBody(campaignUpsertSchema),
  asyncHandler(ctrl.upsertCampaigns),
);

// POST /api/campaigns/scores
campaignRouter.post(
  "/scores",
  validateBody(campaignScoresSchema),
  asyncHandler(ctrl.setScores),
);
