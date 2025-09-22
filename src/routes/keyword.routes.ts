import { Router, Response } from "express";
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
  IntIdParamDto,
  DaysQueryDto,
  IntBulkDto,
} from "../schemas/index.js";
import { TYPES } from "../types/index.js";
import { container } from "../container/container.js";
import { KeywordController } from "../controllers/index.js";

export const keywordRouter = Router({ mergeParams: true });

const ctrl = container.get<KeywordController>(TYPES.KeywordController);

keywordRouter
  .get(
    "/:id/scores",
    validateParams(intIdParamSchema),
    validateQuery,
    async (req: any, res: Response) => {
      await ctrl.getScores(req as GetScoresRequest<IntIdParamDto>, res);
    },
  )
  .get(
    "/:id",
    validateParams(intIdParamSchema),
    async (req: any, res: Response) => {
      await ctrl.getById(req as GetByIdRequest<IntIdParamDto>, res);
    },
  )
  .post("/", validateBody(keywordUpsertSchema.array()), ctrl.upsert)
  .post("/scores", validateBody(keywordScoresSchema), ctrl.setScores)
  .post(
    "/bulkscores",
    validateQuery,
    validateBody(intBulkSchema),
    async (req: any, res: Response) => {
      await ctrl.getBulkScores(req as GetBulkScoresRequest<IntBulkDto>, res);
    },
  );
