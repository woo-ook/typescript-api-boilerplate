import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

import { ForbiddenError } from '@/@types/errors/HTTPErrors';

class Authenticator {
  userLocally = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await passport.authenticate('local', { session: false })(req, res, next);
    } catch (e) {
      return next(e);
    }
  };

  userWithJWT = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    await passport.authenticate('jwt', { session: false })(req, res, next);
  };

  masterPrivilege = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const masterPrivilege = (req as any).user.isMaster;

    if (!masterPrivilege) {
      return next(new ForbiddenError());
    }
    return next();
  };
}

export default new Authenticator();
