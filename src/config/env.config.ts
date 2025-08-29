import dotenvSafe from "dotenv-safe";
dotenvSafe.config();

export const config = {
  uri: process.env.MONGO_URI,
  port: process.env.PORT,
  env: process.env.NODE_ENV,
};
