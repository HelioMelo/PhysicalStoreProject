import logger from "../utils/logger";
import { Response } from "express";

const handleError = (error: unknown, message: string): string => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  logger.error(`${message}: ${errorMessage}`);
  return message;
};

const handleValidationError = (message: string): string => {
  logger.warn(message);
  return message;
};

const handleNotFoundError = (message: string): string => {
  logger.warn(message);
  return message;
};

export const sendErrorResponse = (
  res: Response,
  statusCode: number,
  message: string
) => {
  logger.error(message);
  res.status(statusCode).json({ error: message });
};

export { handleError, handleValidationError, handleNotFoundError };
