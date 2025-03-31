import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { UserDataModel } from "./models/user-data.model";
import { userDataValidators } from "./validators/user-data.validator";
import { validationResult } from "express-validator";
import { errorHandler } from "./middleware/error-handler";
import { CHANNELS } from "@shared/common";
import { rateLimiter } from "./middleware/rate-limiter";
import cors from "cors";
import { corsOptions } from "./middleware/cors-config";
import { RedisService } from "@shared/redis";

const app = express();
const redis = RedisService.getInstance();

// Connect to Redis when the app starts
redis.connect().catch((err) => {
  console.error("Failed to connect to Redis:", err);
});

app.use(express.json());
app.use(cors(corsOptions));
app.use(rateLimiter);

app.post(
  "/receiver",
  userDataValidators,
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userData = {
        id: uuidv4(),
        ...req.body,
        inserted_at: new Date(),
      };

      const savedData = await UserDataModel.create(userData);

      try {
        // Make sure Redis is connected
        if (!redis.isReady) {
          await redis.connect();
        }

        await redis.publish(
          CHANNELS.USER_DATA,
          JSON.stringify({
            type: "USER_DATA_RECEIVED",
            id: uuidv4(),
            timestamp: new Date(),
            data: savedData,
          })
        );
      } catch (redisError) {
        console.warn(
          "ReceiverService: Redis publish failed, but data was saved",
          redisError
        );
      }

      res.status(201).json(savedData);
    } catch (error) {
      console.error("ReceiverService: Error in /receiver route", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

app.use(errorHandler);

export { app };
