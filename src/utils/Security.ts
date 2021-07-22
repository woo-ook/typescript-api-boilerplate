import crypto from 'crypto';

import { Request, Response, NextFunction } from 'express';

class SecurityUtils {
  createSalt = (length = 128): string => {
    if (length % 2 !== 0) throw new Error('Length should be even');

    return crypto.randomBytes(Math.floor(length / 2)).toString('hex');
  };

  hash = (password: string, salt: string, length = 128): string => {
    if (length % 2 !== 0) throw new Error('Length should be even');

    return crypto
      .scryptSync(password, salt, Math.floor(length / 2), { N: 1024 })
      .toString('hex');
  };

  applyXSSProtectionHeader = (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    res.setHeader('X-XSS-Protection', '1; mode=block');

    return next();
  };

  getHelmetOptions = () => ({
    hidePoweredBy: true,
    contentSecurityPolicy: false,
  });

  getCORSOptions = () => ({
    origin: '*',
    optionsSuccessStatus: 200,
  });
}

export default new SecurityUtils();
