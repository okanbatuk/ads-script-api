import "reflect-metadata";
import helmet from "helmet";
import express from "express";
import router from "./routes.js";
import { logger } from "./config/index.js";

export async function buildApp() {
  const app = express();
  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(logger);
  app.use("/api", router);

  return app;
}
