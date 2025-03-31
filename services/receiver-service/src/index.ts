import { app } from "./app";
import { Database } from "@shared/database";
import { Logger } from "@shared/logger";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

dotenv.config();

const logger = new Logger("ReceiverService");
const database = Database.getInstance();

const PORT = process.env.PORT || 3000;
const swaggerDocument = YAML.load(path.join(__dirname, "../swagger.yaml"));

// Add swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

async function start() {
  try {
    await database.connect(process.env.MONGO_URI!);
    app.listen(PORT, () => {
      logger.info(`Receiver service listening on port ${PORT}`);
      logger.info(
        `Swagger documentation available at http://localhost:${PORT}/api-docs`
      );

      // Log available routes
      logger.info("Available routes:");
      logger.info(`POST /receiver - Receive user data`);
      logger.info(`GET /api-docs - Swagger documentation`);
    });
  } catch (error) {
    logger.error("Failed to start service:", error);
    process.exit(1);
  }
}

start();
