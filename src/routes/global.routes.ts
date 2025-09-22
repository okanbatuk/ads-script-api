import { Response, Router } from "express";
import { validateBody, validateQuery } from "../middleware/index.js";
import { TYPES } from "../types/index.js";
import { scoreDateSchema } from "../schemas/index.js";
import { container } from "../container/container.js";
import { GlobalScoreController } from "../controllers/index.js";

export const globalScoreRouter = Router();
const ctrl = container.get<GlobalScoreController>(TYPES.GlobalScoreController);

/* GET /api/global?days=7 */
globalScoreRouter.get("/", validateQuery, async (req: any, res: Response) => {
  await ctrl.getGlobalTrend(req as GetGlobalTrend, res);
});

/* POST /api/global */
globalScoreRouter.post("/", validateBody(scoreDateSchema), ctrl.setGlobalScore);
