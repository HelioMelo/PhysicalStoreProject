import { createLogger, format, transports } from "winston";

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.json()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "logs/data.log", level: "info" }),
    new transports.File({ filename: "logs/error.log", level: "error" }),
  ],
});

export function logError(message: string, details?: any) {
  logger.error({ message, details });
}
export default logger;
