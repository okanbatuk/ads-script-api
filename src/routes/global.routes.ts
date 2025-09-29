import { Response, Router } from "express";
import { TYPES } from "../types/index.js";
import { container } from "../container/container.js";
import type { ScoreDateDto } from "../dtos/index.js";
import { GlobalScoreController } from "../controllers/index.js";
import { validateBody, validateQuery } from "../middleware/index.js";
import { type ScoreDateSchema, scoreDateSchema } from "../schemas/index.js";

export const globalScoreRouter = Router();
const ctrl = container.get<GlobalScoreController>(TYPES.GlobalScoreController);

/* GET /api/global?days=7 */
globalScoreRouter.get("/", validateQuery, async (req: any, res: Response) => {
  await ctrl.getGlobalTrend(req as GetGlobalTrend, res);
});

/* POST /api/global */
globalScoreRouter.post(
  "/",
  validateBody(scoreDateSchema),
  async (req: any, res: Response) => {
    await ctrl.setGlobalScore(
      req as SetScoresRequest<ScoreDateDto, ScoreDateSchema>,
      res,
    );
  },
);
