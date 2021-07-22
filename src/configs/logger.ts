import { format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

import serverConfig from '@/configs/server';
import urlConfig from '@/configs/url';

const { combine, timestamp, json, printf, align, colorize } = format;

const options = {
  global: {
    levels: { error: 0, info: 1, http: 2, debug: 3 },
    level: serverConfig().MODE === 'DEBUG' ? 'debug' : 'http',
  },
  daily: (level: 'error' | 'combined') => ({
    ...(level === 'error' ? { level: 'error' } : {}),
    datePattern: 'YYYY-MM-DD',
    dirname: `${urlConfig().LOG_OUTPUT_PATH}/${level}`,
    filename: `%DATE%.${level}.log`,
    maxFiles: 30,
    zippedArchive: true,
    format: combine(
      timestamp({
        format: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
      }),
      json(),
    ),
  }),
  console: {
    format: combine(
      timestamp({
        format: 'YYYY-MM-DD HH:mm:ss.SSS',
      }),
      printf(
        ({ timestamp: ts, level: lvl, message, source, stack }) =>
          `${ts} [${lvl}]${source ? ` (${source}) ` : ' '}${message}${
            stack ? `\n${stack}` : ''
          }`,
      ),
      align(),
      colorize({
        all: true,
        colors: {
          error: 'bold red',
          info: 'green',
          http: 'magenta',
          debug: 'white',
        },
      }),
    ),
  },
};

const loggerConfig = () => {
  const { global, daily, console } = options;
  const { level, levels } = global;

  const dailyErrorTransport = new DailyRotateFile(daily('error'));
  const dailyCombinedTransport = new DailyRotateFile(daily('combined'));
  const consoleTransport = new transports.Console(console);

  return {
    level,
    levels,
    transports: [dailyErrorTransport, dailyCombinedTransport, consoleTransport],
  };
};

export default loggerConfig;
