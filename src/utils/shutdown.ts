import { Database } from "../database";

const state = { handled: false };

export function gracefulShutdown(server?: any) {
  const shutdown = async (signal: string) => {
    // Prevent multiple shutdown attempts.
    if (state.handled) return;
    state.handled = true;

    console.log(`------${signal} received, shutting down...`);

    // Close HTTP Server
    if (server) server.close();

    // Disconnect Prisma
    await Database.disconnectDB();

    process.exit(0);
  };

  // Remove old listeners
  process.removeAllListeners("SIGINT");
  process.removeAllListeners("SIGTERM");

  // Attach new listener for shutdown
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}
