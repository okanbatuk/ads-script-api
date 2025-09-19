import "reflect-metadata";
import helmet from "helmet";
import cors from "cors";
import express, { Request, Response } from "express";
import router from "./routes.js";
import { config, logger } from "./config/index.js";
import { errorHandler, sendResponse } from "./utils/index.js";

export async function buildApp() {
  const ENV = process.env.NODE_ENV || config.env;
  const WS_URL = process.env.WEBSITE_URL || config.website;
  const app = express();
  app.use(cors());
  // if (ENV === "development") app.use(cors());
  // else
  //   app.use(
  //     cors({
  //       origin: WS_URL,
  //     }),
  //   );
  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(logger);
  app.get("/", async (req: Request, res: Response): Promise<Response> => {
    console.log("Root route hit!");
    return sendResponse(res, 200, undefined, "Ads API working on Server!");
  });
  app.use("/api", router);
  app.use(errorHandler);

  return app;
}
