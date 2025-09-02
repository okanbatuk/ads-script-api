import "reflect-metadata";
import helmet from "helmet";
import express, { Request, Response } from "express";
import router from "./routes.js";
import { logger } from "./config/index.js";
import { errorHandler, sendResponse } from "./utils/index.js";

export async function buildApp() {
  const app = express();
  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(logger);
  app.get("/", async (req: Request, res: Response): Promise<Response> => {
    console.log("Root route hit!");
    return sendResponse(res, 200, undefined, "Ads API working on Vercel!");
  });
  app.use("/api", router);
  app.use(errorHandler);

  return app;
}
