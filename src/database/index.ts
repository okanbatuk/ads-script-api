import { prisma } from "../models/prisma";

export abstract class Database {
  public static async connectDB(): Promise<void> {
    await prisma.$connect();
  }

  public static async disconnectDB(): Promise<void> {
    await prisma.$disconnect();
  }
}
