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
  type BigIntIdParamDto,
  type BigIntBulkDto,
  type AccountUpsertSchema,
  type AccountScoresSchema,
} from "../schemas/index.js";
import type {
  AccountScoresDto,
  AccountUpsertDto,
  IdBulkDto,
  IdParamDto,
} from "../dtos/index.js";

export const accountRouter = Router({ mergeParams: true });
const ctrl = container.get<AccountController>(TYPES.AccountController);

/* GET /api/accounts/:id/scores?days=7 */
accountRouter.get(
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

/* GET /api/accounts/:id */
accountRouter.get(
  "/:id",
  validateParams(bigIntIdParamSchema),
  async (req: any, res: Response) => {
    await ctrl.getById(
      req as GetByIdRequest<IdParamDto, BigIntIdParamDto>,
      res,
    );
  },
);

/* POST /api/accounts */
accountRouter.post(
  "/",
  validateBody(accountUpsertSchema.array()),
  async (req: any, res: Response) => {
    await ctrl.upsert(
      req as UpsertRequest<AccountUpsertDto, AccountUpsertSchema>,
      res,
    );
  },
);

/* POST /api/accounts/scores */
accountRouter.post(
  "/scores",
  validateBody(accountScoresSchema),
  async (req: any, res: Response) => {
    await ctrl.setScores(
      req as SetScoresRequest<AccountScoresDto, AccountScoresSchema>,
      res,
    );
  },
);

/* POST /api/accounts/bulkscores?days=7 */
accountRouter.post(
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
