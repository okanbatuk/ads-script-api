import { prisma } from "../models/prisma.js";

export abstract class Database {
  public static async connectDB(): Promise<void> {
    await prisma.$connect();
    console.info(`Database connected!`);
  }

  public static async disconnectDB(): Promise<void> {
    await prisma.$disconnect();
    console.info(`Database disconnected!`);
  }

  private static async attemptConnection(retries = 3): Promise<boolean> {
    for (let i = 0; i < retries; i++) {
      try {
        await prisma.$connect();
        await prisma.$queryRaw`SELECT 1`;
        console.info(`Database connected!`);
        return true;
      } catch (error) {
        console.warn(`Connection attempt ${i + 1} failed, retrying...`);
        if (i === retries - 1) {
          console.error("All connection attempts failed:", error);
          return false;
        }

        // 1 saniye bekle sonra tekrar dene
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
    return false;
  }

  // Database Health Check
  public static async healthCheck(): Promise<boolean> {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.info("Database health check failed:", error);
      return await Database.attemptConnection();
    }
  }
}
