import { Response, Router } from "express";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../middleware/index.js";
import {
  BigIntBulkDto,
  bigIntBulkSchema,
  BigIntIdParamDto,
  bigIntIdParamSchema,
  campaignScoresSchema,
  campaignUpsertSchema,
} from "../schemas/index.js";
import { TYPES } from "../types/index.js";
import { CampaignController } from "../controllers/index.js";
import { container } from "../container/container.js";

export const campaignRouter = Router({ mergeParams: true });

const ctrl = container.get<CampaignController>(TYPES.CampaignController);

// GET /api/campaigns/:id/scores?days=7
campaignRouter.get(
  "/:id/scores",
  validateParams(bigIntIdParamSchema),
  validateQuery,
  async (req: any, res: Response) => {
    await ctrl.getScores(req as GetScoresRequest<BigIntIdParamDto>, res);
  },
);

// GET /api/campaigns/:id
campaignRouter.get(
  "/:id",
  validateParams(bigIntIdParamSchema),
  async (req: any, res: Response) => {
    await ctrl.getById(req as GetByIdRequest<BigIntIdParamDto>, res);
  },
);

// POST /api/campaigns  (upsert)
campaignRouter.post(
  "/",
  validateBody(campaignUpsertSchema),
  ctrl.upsertCampaigns,
);

// POST /api/campaigns/scores
campaignRouter.post(
  "/scores",
  validateBody(campaignScoresSchema),
  ctrl.setScores,
);

// POST /api/campaigns/bulkscores?days=7
campaignRouter.post(
  "/bulkscores",
  validateQuery,
  validateBody(bigIntBulkSchema),
  async (req: any, res: Response) => {
    await ctrl.getBulkScores(req as GetBulkScoresRequest<BigIntBulkDto>, res);
  },
);
