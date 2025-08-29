import dotenvSafe from "dotenv-safe";
dotenvSafe.config();

export const config = {
  uri: process.env.MONGO_URI,
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV,
};
