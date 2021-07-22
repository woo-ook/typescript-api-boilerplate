import appRoot from 'app-root-path';
import path from 'path';

import * as winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';

const logDir = path.resolve(appRoot.toString(), 'logs'); // logs 디렉토리 하위에 로그 파일 저장
const { combine, timestamp, label, printf } = winston.format;

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const logger = winston.createLogger({
  format: combine(
    label({ label: 'TEST' }),
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    // log format
    printf(
      ({ level, message, label, timestamp }) =>
        `${timestamp} [${label}] ${level}: ${message}`,
    ),
  ),
  transports: [
    // error 레벨 로그를 저장할 파일 설정
    new winstonDaily({
      level: 'error',
      handleExceptions: true,
      datePattern: 'YYYY-MM-DD',
      dirname: `${logDir}/error`, // error.log 파일은 /logs/error 하위에 저장
      filename: `%DATE%.error.log`,
      maxFiles: 30,
      zippedArchive: true,
    }),

    // info 레벨 로그를 저장할 파일 설정
    new winstonDaily({
      level: 'info',
      handleExceptions: true,
      datePattern: 'YYYY-MM-DD',
      dirname: logDir,
      filename: `%DATE%.log`,
      maxFiles: 30, // 30일치 로그 파일 저장
      zippedArchive: true,
    }),
  ],
});

// Production 환경이 아닌 경우(dev 등)
if (process.env.NODE_ENV === 'development') {
  logger.add(
    new winston.transports.Console({
      handleExceptions: true,
      format: winston.format.combine(
        winston.format.colorize(), // 색깔 넣어서 출력
        winston.format.simple(), // `${info.level}: ${info.message} JSON.stringify({ ...rest })` 포맷으로 출력
      ),
    }),
  );
}

export default logger;
