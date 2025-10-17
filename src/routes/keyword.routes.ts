import { Router, Response } from "express";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../middleware/index.js";
import {
  intIdParamSchema,
  intBulkSchema,
  keywordUpsertSchema,
  keywordScoresSchema,
  type IntIdParamDto,
  type IntBulkDto,
  type KeywordUpsertSchema,
  type KeywordSetScoreSchema,
} from "../schemas/index.js";
import { TYPES } from "../types/index.js";
import { container } from "../container/container.js";
import { KeywordController } from "../controllers/index.js";

import type {
  IdBulkDto,
  IdParamDto,
  KeywordScoresDto,
  KeywordUpsertDto,
} from "../dtos/index.js";

export const keywordRouter = Router({ mergeParams: true });

const ctrl = container.get<KeywordController>(TYPES.KeywordController);

keywordRouter
  .get(
    "/:id/scores",
    validateParams(intIdParamSchema),
    validateQuery,
    async (req: any, res: Response) => {
      await ctrl.getScores(
        req as GetScoresRequest<IdParamDto, IntIdParamDto>,
        res,
      );
    },
  )
  .get(
    "/:id",
    validateParams(intIdParamSchema),
    async (req: any, res: Response) => {
      await ctrl.getById(req as GetByIdRequest<IdParamDto, IntIdParamDto>, res);
    },
  )
  .post(
    "/",
    validateBody(keywordUpsertSchema.array()),
    async (req: any, res: Response) => {
      await ctrl.upsert(
        req as UpsertRequest<KeywordUpsertDto[], KeywordUpsertSchema[]>,
        res,
      );
    },
  )
  // .post(
  //   "/ids",
  //   validateBody(keywordBulkDtoSchema),
  //   async (req: any, res: Response) => {
  //     await ctrl.getIds(
  //       req as GetBulkRequest<
  //         { pairs: KeywordBulkDto[] },
  //         { pairs: KeywordBulkSchema }
  //       >,
  //       res,
  //     );
  //   },
  // )
  .post(
    "/scores",
    validateBody(keywordScoresSchema),
    async (req: any, res: Response) => {
      await ctrl.setScores(
        req as SetScoresRequest<KeywordScoresDto[], KeywordSetScoreSchema>,
        res,
      );
    },
  )
  .post(
    "/bulkscores",
    validateQuery,
    validateBody(intBulkSchema),
    async (req: any, res: Response) => {
      await ctrl.getBulkScores(
        req as GetBulkScoresRequest<IdBulkDto, IntBulkDto>,
        res,
      );
    },
  );
