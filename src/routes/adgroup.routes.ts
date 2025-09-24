import { Response, Router } from "express";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../middleware/index.js";
import {
  bigIntIdParamSchema,
  adGroupUpsertSchema,
  adGroupScoresSchema,
  bigIntBulkSchema,
  type BigIntIdParamDto,
  type BigIntBulkDto,
  type AdGroupUpsertSchema,
  type AdGroupScoresSchema,
} from "../schemas/index.js";
import { TYPES } from "../types/index.js";
import { container } from "../container/container.js";
import { AdGroupController } from "../controllers/index.js";
import type { IdParamDto } from "../dtos/id-param.dto.js";
import type {
  AdGroupScoresDto,
  AdGroupUpsertDto,
  IdBulkDto,
} from "../dtos/index.js";

export const adGroupRouter = Router();
const ctrl = container.get<AdGroupController>(TYPES.AdGroupController);

/* GET /api/adgroups/:id/scores?days=7 */
adGroupRouter.get(
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

/* GET /api/adgroups/:id */
adGroupRouter.get(
  "/:id",
  validateParams(bigIntIdParamSchema),
  async (req: any, res: Response) => {
    await ctrl.getById(
      req as GetByIdRequest<IdParamDto, BigIntIdParamDto>,
      res,
    );
  },
);

/* POST /api/adgroups */
adGroupRouter.post(
  "/",
  validateBody(adGroupUpsertSchema.array()),
  async (req: any, res: Response) => {
    await ctrl.upsert(
      req as UpsertRequest<AdGroupUpsertDto, AdGroupUpsertSchema>,
      res,
    );
  },
);

/* POST /api/adgroups/scores */
adGroupRouter.post(
  "/scores",
  validateBody(adGroupScoresSchema),
  async (req: any, res: Response) => {
    await ctrl.setScores(
      req as SetScoresRequest<AdGroupScoresDto, AdGroupScoresSchema>,
      res,
    );
  },
);

/* POST /api/adgroups/bulkscores?days=7 */
adGroupRouter.post(
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
