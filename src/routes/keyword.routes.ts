import { Router } from "express";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../middleware/index.js";
import {
  intIdParamSchema,
  keywordUpsertSchema,
  keywordScoresSchema,
  intBulkSchema,
  IntBulkDto,
  DaysQueryDto,
} from "../schemas/index.js";
import { TYPES } from "../types/index.js";
import { asyncHandler } from "../utils/index.js";
import { container } from "../container/container.js";
import { KeywordController } from "../controllers/index.js";

export const keywordRouter = Router({ mergeParams: true });

const ctrl = container.get<KeywordController>(TYPES.KeywordController);

keywordRouter
  .get(
    "/bulkscores",
    validateQuery,
    validateBody(intBulkSchema),
    ctrl.getBulkScores,
  )
  .get(
    "/:id/scores",
    validateParams(intIdParamSchema),
    validateQuery,
    ctrl.getScores,
  )
  .get("/:id", validateParams(intIdParamSchema), ctrl.getById)
  .post("/", validateBody(keywordUpsertSchema.array()), ctrl.upsert)
  .post("/scores", validateBody(keywordScoresSchema), ctrl.setScores);
