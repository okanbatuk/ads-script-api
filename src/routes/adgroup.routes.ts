// src/routes/adGroup.routes.ts
import { Router } from "express";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../middleware/index.js";
import {
  bigIntIdParamSchema,
  adGroupUpsertSchema,
  adGroupScoresSchema,
  adGroupBulkBodySchema,
} from "../schemas/index.js";
import { TYPES } from "../types/index.js";
import { container } from "../container/container.js";
import { AdGroupController } from "../controllers/index.js";

export const adGroupRouter = Router();
const ctrl = container.get<AdGroupController>(TYPES.AdGroupController);

/* GET /api/adgroups/:id/scores?days=7 */
adGroupRouter.get(
  "/:id/scores",
  validateParams(bigIntIdParamSchema),
  validateQuery,
  ctrl.getScores,
);

/* GET /api/adgroups/bulkscores?days=7 */
adGroupRouter.get(
  "/bulkscores",
  validateQuery,
  validateBody(adGroupBulkBodySchema),
  ctrl.getBulkScores,
);

/* GET /api/adgroups/:id */
adGroupRouter.get("/:id", validateParams(bigIntIdParamSchema), ctrl.getById);

/* POST /api/adgroups */
adGroupRouter.post("/", validateBody(adGroupUpsertSchema.array()), ctrl.upsert);

/* POST /api/adgroups/scores */
adGroupRouter.post(
  "/scores",
  validateBody(adGroupScoresSchema),
  ctrl.setScores,
);
