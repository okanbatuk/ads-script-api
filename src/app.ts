import "reflect-metadata";
import express from "express";
import router from "./routes";
import { logger } from "./config";

export async function buildApp() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(logger);
  app.use("/api", router);

  return app;
}
