import { Express, Request, Response } from "express";
import { buildApp } from "./app.js";
import { config } from "./config/index.js";
import { Database } from "./database/index.js";
import { gracefulShutdown } from "./utils/index.js";

const PORT = process.env.PORT || config.port;
const ENV = process.env.NODE_ENV || config.env;

let app: Express | null = null;
await Database.connectDB();

// Handler export for Vercel
export default async function handler(req: Request, res: Response) {
  if (!app) app = await buildApp();
  return app(req, res);
}

// Local development
if (ENV !== "production") {
  app = await buildApp();
  gracefulShutdown();
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
  });
}
