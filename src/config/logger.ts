import winston from 'winston';


const {
  combine,
  timestamp,
  errors,
  json,
  colorize,
  printf,
} = winston.format;

const consoleFormat = printf(
  ({
    level,
    message,
    timestamp,
    stack,
  }) => {
    return `${timestamp} [${level}]: ${
      stack || message
    }`;
  },
);

import { HttpLogTransport }
  from '../transport/httpLogTransport';

const transports = [
  new winston.transports.Console(),
];

if (
  process.env
    .LOG_STREAM_ENABLED ===
  'true'
) {
  transports.push(
    new HttpLogTransport({
      level: 'info',
    }) as any,
  );
}

export const logger =
  winston.createLogger({
    level: 'info',

    format: combine(
      timestamp(),
      errors({ stack: true }),
      json(),
    ),

    defaultMeta: {
      service: 'backend-api',
    },

    transports: [
      // Error Logs
      new winston.transports.File({
        filename:
          'logs/error.log',
        level: 'error',
      }),

      // Combined Logs
      new winston.transports.File({
        filename:
          'logs/combined.log',
      }),
    ],
  });

if (
  process.env.NODE_ENV !==
  'production'
) {
  logger.add(
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp(),
        consoleFormat,
      ),
    }),
  );
}