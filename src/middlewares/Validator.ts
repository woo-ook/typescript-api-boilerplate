import { Request, Response, NextFunction, RequestHandler } from 'express';
import { validationResult, ValidationChain, oneOf } from 'express-validator';

import { BadRequestError } from '@/@types/errors/HTTPErrors';

class ValidationMiddlewares {
  static validate = (validations: ValidationChain[]): RequestHandler => async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const promises = validations.map((validation) => validation.run(req));
      await Promise.all(promises);

      const results = validationResult(req);

      if (!results.isEmpty()) {
        throw new BadRequestError(undefined, results.array());
      }
      return next();
    } catch (e) {
      return next(e);
    }
  };

  static validateOneOf = (
    validations: ValidationChain[] | ValidationChain[][],
    message: string,
  ): RequestHandler => async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await oneOf(validations).run(req);
      const results = validationResult(req);

      if (!results.isEmpty()) {
        throw new BadRequestError(message, results.array());
      }
      return next();
    } catch (e) {
      return next(e);
    }
  };
}

export default ValidationMiddlewares;
