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
    asyncHandler(ctrl.getBulkScores),
  )
  .get(
    "/:id/scores",
    validateParams(intIdParamSchema),
    validateQuery,
    asyncHandler(ctrl.getScores),
  )
  .get("/:id", validateParams(intIdParamSchema), asyncHandler(ctrl.getById))
  .post(
    "/",
    validateBody(keywordUpsertSchema.array()),
    asyncHandler(ctrl.upsert),
  )
  .post(
    "/scores",
    validateBody(keywordScoresSchema),
    asyncHandler(ctrl.setScores),
  );
