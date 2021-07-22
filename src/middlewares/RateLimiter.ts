import { Request, Response, NextFunction } from 'express';
import ExpressBrute from 'express-brute';
import moment from 'moment-timezone';
import toobusy from 'toobusy-js';

import {
  TooManyRequestsError,
  InternalServerError,
  ServiceUnavailableError,
} from '@/@types/errors/HTTPErrors';
import { Logger, l } from '@/modules';

class RateLimitingMiddlewares {
  constructor() {
    if (toobusy.started()) {
      toobusy.maxLag(100);

      Logger.info(
        ...l('Middleware')(
          `MaxLag: ${toobusy.maxLag()}ms, Interval: ${toobusy.interval()}ms`,
        ),
      );

      toobusy.onLag((currentLag) => {
        Logger.info(
          ...l('Middleware')(
            `Event loop lag detected! Latency: ${currentLag.toFixed(2)}ms`,
          ),
        );
      });
    }
  }

  checkServerBusy = (req: Request, res: Response, next: NextFunction): void => {
    if (toobusy()) {
      return next(
        new ServiceUnavailableError(
          'Server is too busy. Please try again later.',
        ),
      );
    }
    return next();
  };

  byRequestIP = (
    numRetries: number,
    minWaitSec: number,
    maxWaitSec: number,
    lifetimeSec: number,
  ) => {
    const store = new ExpressBrute.MemoryStore();

    const bruteforce = new ExpressBrute(store, {
      freeRetries: numRetries,
      minWait: minWaitSec * 1000,
      maxWait: maxWaitSec * 1000,
      lifetime: lifetimeSec,
      handleStoreError: (err: Error) => {
        Logger.error(...l('Middleware')(err));

        throw new InternalServerError();
      },
    });

    return bruteforce.getMiddleware({
      key: (req: Request, res: Response, next: NextFunction) => {
        return next(req.ip);
      },
      failCallback: this.failCallback,
      ignoreIP: false,
    });
  };

  private failCallback = (
    req: Request,
    res: Response,
    next: NextFunction,
    nextValidRequestDate: Date,
  ) => {
    const timeNow = moment().utcOffset('+0900', true);
    const nextValidMoment = moment(nextValidRequestDate).utcOffset(
      '+0900',
      true,
    );
    Logger.info(
      ...l('Middleware')(
        `Username "${req.user}" at ${timeNow}, next attempt ${nextValidMoment}`,
      ),
    );

    return next(
      new TooManyRequestsError(
        `Request limit reached for this time frame.`,
        nextValidMoment,
      ),
    );
  };
}

export default new RateLimitingMiddlewares();
