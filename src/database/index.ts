import { MongoClient } from "mongodb";
import { config } from "../config";

export abstract class Database {
  private static client = new MongoClient(config.uri as string);
  private static db: Database | null = null;

  public static async connectDB(): Promise<Database> {
    if (!Database.db) {
      await Database.client.connect();
      Database.db = Database.client.db();
      console.info(`MongoDB connected!`);
    }
    return Database.db;
  }

  public static async disconnectDB(): Promise<void> {
    if (Database.client) {
      await Database.client.close();
      Database.db = null;
      console.info(`MongoDB disconnected!`);
    }
  }
}
