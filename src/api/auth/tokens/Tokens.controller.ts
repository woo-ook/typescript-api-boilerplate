import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';

import TokensService from './Tokens.service';

class TokensController {
  private readonly tokensService: TokensService;
  constructor() {
    this.tokensService = Container.get(TokensService);
  }

  issueJWT = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<JSON> | void> => {
    const { username } = req.body;

    try {
      const jwt = await this.tokensService.createToken(username);

      return res.status(201).json({ jwt }).end();
    } catch (e) {
      return next(e);
    }
  };

  deleteJWT = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const username = (req as any).user.name as string;
      await this.tokensService.deleteToken(username);

      return res.status(204).end();
    } catch (e) {
      return next(e);
    }
  };
}

export default new TokensController();
