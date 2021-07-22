import { Request, Response, NextFunction } from 'express';

import { MethodNotAllowedError } from '@/@types/errors/HTTPErrors';

class APIController {
  static disallowRequest = (
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    return next(new MethodNotAllowedError());
  };
}

export default APIController;
