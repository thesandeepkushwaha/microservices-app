import { Request, Response, NextFunction } from "express";
import { Logger } from "@shared/logger";

const logger = new Logger("ErrorHandler");

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error("Error:", err);

  if (err.message === "Request from unauthorized origin") {
    return res.status(403).json({
      error: "Request from unauthorized origin",
    });
  }

  res.status(500).json({
    error: "Internal server error",
  });
};
