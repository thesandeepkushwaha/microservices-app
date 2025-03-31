import mongoose from "mongoose";
import { Logger } from "@shared/logger";

export class Database {
  private static instance: Database;
  private logger: Logger;

  private constructor() {
    this.logger = new Logger("Database");
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async connect(uri: string): Promise<void> {
    try {
      await mongoose.connect(uri);
      this.logger.info("Connected to MongoDB");
    } catch (error) {
      this.logger.error("MongoDB connection error:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      this.logger.info("Disconnected from MongoDB");
    } catch (error) {
      this.logger.error("MongoDB disconnection error:", error);
      throw error;
    }
  }
}
