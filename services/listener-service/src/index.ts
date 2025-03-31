import { Database } from "@shared/database";
import { RedisService } from "@shared/redis";
import { Logger } from "@shared/logger";
import { UserDataModifiedModel } from "./models/user-data-modified.model";
import { UserDataReceivedEvent, CHANNELS } from "@shared/common";
import dotenv from "dotenv";

dotenv.config();
const logger = new Logger("ListenerService");
const redis = RedisService.getInstance();
const database = Database.getInstance();

async function start() {
  try {
    await database.connect(process.env.MONGO_URI!);
    await redis.connect();

    await redis.subscribe(CHANNELS.USER_DATA, async (message) => {
      try {
        const event = JSON.parse(message) as UserDataReceivedEvent;
        logger.info("Received user data:", event);
        if (event.type === "USER_DATA_RECEIVED") {
          logger.info("Received user data:", event.data);
          const modifiedData = {
            ...event.data,
            modified_at: new Date(),
          };

          await UserDataModifiedModel.create(modifiedData);
          logger.info(`Processed user data with ID: ${modifiedData.id}`);
        }
      } catch (error) {
        logger.error("Error processing message:", error);
      }
    });

    logger.info("Listener service started successfully");
  } catch (error) {
    logger.error("Failed to start service:", error);
    process.exit(1);
  }
}

start();
