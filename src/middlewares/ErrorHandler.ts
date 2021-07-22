import { Request, Response, NextFunction } from 'express';

import { HTTPError, DBError } from '@/@types/errors';
import { InternalServerError } from '@/@types/errors/HTTPErrors';
import { Logger, l, Database, Server } from '@/modules';

class ErrorHandlingMiddlewares {
  handleConnectionHeader = (
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    if (!Server.keepAlive) {
      res.set('Connection', 'close');
    }
    return next();
  };

  handleDBError = (
    err: DBError,
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    if (err.sqlState) {
      const { code, sqlState, sqlMessage, errno } = err;
      const dbError = new DBError(code, sqlState, sqlMessage, errno);
      Logger.error(...l('Database')(dbError));

      return next(
        new InternalServerError('Something went wrong with the database'),
      );
    }

    return next(err);
  };

  handleHTTPError = async (
    err: HTTPError,
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<JSON> | void> => {
    if (err instanceof HTTPError) {
      return res.status(err.status).json(err.toClientConsumable());
    }

    Logger.error(...l('Unexpected')(err));
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Something went wrong. Please contact developers.',
    });
  };

  shutdownGracefully = async (error?: Error): Promise<void> => {
    try {
      if (error) {
        Logger.error(...l('Unexpected')(error));
        // await Alarm.send(error);
      }

      await Database.disconnect();
      Server.close();

      setTimeout(async () => {
        // await Alarm.send('Server is shutting down gracefully');
        process.exit(0);
      }, 1000);
    } catch (err) {
      Logger.error(...l('Unexpected')(err));
      process.exit(1);
    }
  };
}

export default new ErrorHandlingMiddlewares();
