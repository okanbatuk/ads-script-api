import pinoHttp from "pino-http";
import { config } from "./env.config.ts";

export const logger = pinoHttp({
  level: "info",
  transport:
    config.env === "development"
      ? {
          target: "pino-pretty",
          options: { translateTime: "HH:MM:ss", colorize: true },
        }
      : undefined,
});
