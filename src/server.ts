import { buildApp } from "./app";
import { config } from "./config";
import { Database } from "./database";
import { gracefulShutdown } from "./utils/shutdown";

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
