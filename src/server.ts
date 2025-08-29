import { buildApp } from "./app.js";
import { config } from "./config/index.js";
import { Database } from "./database/index.js";
import { gracefulShutdown } from "./utils/index.js";

(async () => {
  const app = await buildApp();
  try {
    await Database.connectDB();

    // Handlers for close the server and db
    gracefulShutdown();

    app.listen(config.port);
    console.log(`🚀  Server ready at http://localhost:${config.port}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
