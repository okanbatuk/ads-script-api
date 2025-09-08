import dotenvSafe from "dotenv-safe";

if (process.env.NODE_ENV !== "production") dotenvSafe.config();

export const config = {
  db: process.env.DATABASE_URL,
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV,
  website: process.env.WEBSITE_URL,
};
