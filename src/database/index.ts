import { prisma } from "../models/prisma";

export abstract class Database {
  public static async connectDB(): Promise<void> {
    await prisma.$connect();
    console.info(`Database connected!`);
  }

  public static async disconnectDB(): Promise<void> {
    await prisma.$disconnect();
    console.info(`Database disconnected!`);
  }
}
