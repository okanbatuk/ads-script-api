import { buildApp } from "./app.js";
import { config } from "./config/index.js";
import { Database } from "./database/index.js";
import { gracefulShutdown } from "./utils/index.js";

const PORT = process.env.PORT || config.port;

(async () => {
  const app = await buildApp();
  try {
    await Database.connectDB();

    // Handlers for close the server and db
    gracefulShutdown();

    app.listen(PORT);
    console.log(`🚀  Server ready at http://localhost:${PORT}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
