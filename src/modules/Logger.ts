/* eslint-disable max-classes-per-file */

import winston from 'winston';

import { LoggerSource } from '@/@types/Option';

import loggerConfig from '@/configs/logger';

const l = (source?: LoggerSource) => (
  loggable: Error | string,
): [string, Record<string, unknown>] => {
  if (loggable instanceof Error) {
    const { name, message, stack } = loggable;

    return [
      message,
      {
        source,
        name,
        ...(stack ? { stack } : {}),
      },
    ];
  }
  if (typeof loggable === 'string') {
    return [loggable, { source }];
  }
  // return [JSON.stringify(loggable), { source }];
  return [loggable, { source }];
};

const Logger = (): winston.Logger => {
  const { level, levels, transports } = loggerConfig();

  const logger = winston.createLogger({
    level,
    levels,
    transports,
  });

  return logger;
};

export default Logger();
export { l };
