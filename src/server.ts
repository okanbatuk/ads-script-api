import { buildApp } from "./app.js";
import { config } from "./config/index.js";
import { Database } from "./database/index.js";
import { gracefulShutdown } from "./utils/index.js";

const PORT = process.env.PORT || config.port;
const ENV = process.env.NODE_ENV || config.env;

await Database.connectDB();
const app = await buildApp();

gracefulShutdown();
app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});
