// File: src/utils/logger.js
import winston from 'winston';
import path from 'path';

const logDir = 'logs';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join(logDir, 'combined.log') }),
    new winston.transports.Console()
  ]
});

export const logInfo = (message) => {
  logger.info(message);
};

export const logError = (message) => {
  logger.error(message);
};
