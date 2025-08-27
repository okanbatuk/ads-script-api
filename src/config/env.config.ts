import dotenv from "dotenv";
dotenv.config();

export const config = {
  uri: process.env.MONGO_URI,
  port: process.env.PORT,
  env: process.env.NODE_ENV,
};
