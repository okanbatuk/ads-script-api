import { Response, Router } from "express";
import { TYPES } from "../types/index.js";
import { AccountController } from "../controllers/index.js";
import { container } from "../container/container.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../middleware/index.js";
import {
  bigIntIdParamSchema,
  accountUpsertSchema,
  accountScoresSchema,
  bigIntBulkSchema,
  BigIntIdParamDto,
  BigIntBulkDto,
} from "../schemas/index.js";

export const accountRouter = Router({ mergeParams: true });
const ctrl = container.get<AccountController>(TYPES.AccountController);

/* GET /api/accounts/:id/scores?days=7 */
accountRouter.get(
  "/:id/scores",
  validateParams(bigIntIdParamSchema),
  validateQuery,
  async (req: any, res: Response) => {
    await ctrl.getScores(req as GetScoresRequest<BigIntIdParamDto>, res);
  },
);

/* GET /api/accounts/:id */
accountRouter.get(
  "/:id",
  validateParams(bigIntIdParamSchema),
  async (req: any, res: Response) => {
    await ctrl.getById(req as GetByIdRequest<BigIntIdParamDto>, res);
  },
);

/* POST /api/accounts */
accountRouter.post("/", validateBody(accountUpsertSchema.array()), ctrl.upsert);

/* POST /api/accounts/scores */
accountRouter.post(
  "/scores",
  validateBody(accountScoresSchema),
  ctrl.setScores,
);

/* POST /api/accounts/bulkscores?days=7 */
accountRouter.post(
  "/bulkscores",
  validateQuery,
  validateBody(bigIntBulkSchema),
  async (req: any, res: Response) => {
    await ctrl.getBulkScores(req as GetBulkScoresRequest<BigIntBulkDto>, res);
  },
);
