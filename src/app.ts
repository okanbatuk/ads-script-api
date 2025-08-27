import express from "express";
import { logger } from "./config/index.ts";

export async function buildApp() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(logger);

  return app;
}
