import { Router } from "express";
import { KeywordController } from "../controllers/index.js";
import { TYPES } from "../types/index.js";
import { container } from "../container/container.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../middleware/index.js";
import {
  keywordBulkBodySchema,
  intIdParamSchema,
  keywordUpsertSchema,
} from "../schemas/index.js";

export const keywordRouter = Router();

const ctrl = container.get<KeywordController>(TYPES.KeywordController);

keywordRouter
  .get(
    "/bulkscores",
    validateQuery,
    validateBody(keywordBulkBodySchema),
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
  .post("/scores", ctrl.setScores);
