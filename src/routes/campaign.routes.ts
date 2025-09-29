import { Response, Router } from "express";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../middleware/index.js";
import {
  type BigIntBulkDto,
  bigIntBulkSchema,
  type BigIntIdParamDto,
  bigIntIdParamSchema,
  type CampaignScoresSchema,
  campaignScoresSchema,
  type CampaignUpsertSchema,
  campaignUpsertSchema,
} from "../schemas/index.js";
import { TYPES } from "../types/index.js";
import { CampaignController } from "../controllers/index.js";
import { container } from "../container/container.js";
import type {
  CampaignScoresDto,
  CampaignUpsertDto,
  IdBulkDto,
  IdParamDto,
} from "../dtos/index.js";

export const campaignRouter = Router({ mergeParams: true });

const ctrl = container.get<CampaignController>(TYPES.CampaignController);

// GET /api/campaigns/:id/adgroups
campaignRouter.get(
  "/:id/adgroups",
  validateParams(bigIntIdParamSchema),
  async (req: any, res: Response) => {
    await ctrl.getAdGroups(
      req as GetByIdRequest<IdParamDto, BigIntIdParamDto>,
      res,
    );
  },
);

// GET /api/campaigns/:id/scores?days=7
campaignRouter.get(
  "/:id/scores",
  validateParams(bigIntIdParamSchema),
  validateQuery,
  async (req: any, res: Response) => {
    await ctrl.getScores(
      req as GetScoresRequest<IdParamDto, BigIntIdParamDto>,
      res,
    );
  },
);

// GET /api/campaigns/:id
campaignRouter.get(
  "/:id",
  validateParams(bigIntIdParamSchema),
  async (req: any, res: Response) => {
    await ctrl.getById(
      req as GetByIdRequest<IdParamDto, BigIntIdParamDto>,
      res,
    );
  },
);

// POST /api/campaigns  (upsert)
campaignRouter.post(
  "/",
  validateBody(campaignUpsertSchema.array()),
  async (req: any, res: Response) => {
    await ctrl.upsertCampaigns(
      req as UpsertRequest<CampaignUpsertDto[], CampaignUpsertSchema[]>,
      res,
    );
  },
);

// POST /api/campaigns/scores
campaignRouter.post(
  "/scores",
  validateBody(campaignScoresSchema),
  async (req: any, res: Response) => {
    await ctrl.setScores(
      req as SetScoresRequest<CampaignScoresDto, CampaignScoresSchema>,
      res,
    );
  },
);

// POST /api/campaigns/bulkscores?days=7
campaignRouter.post(
  "/bulkscores",
  validateQuery,
  validateBody(bigIntBulkSchema),
  async (req: any, res: Response) => {
    await ctrl.getBulkScores(
      req as GetBulkScoresRequest<IdBulkDto, BigIntBulkDto>,
      res,
    );
  },
);
