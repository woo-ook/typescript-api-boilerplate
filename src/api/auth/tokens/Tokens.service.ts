import { Service } from 'typedi';
import { v4 as uuid } from 'uuid';

import serverConfig from '@/configs/server';
import { InternalServerError } from '@/@types/errors/HTTPErrors';

import TokensModel from './Tokens.model';

@Service()
class TokensService {
  constructor(private model: TokensModel) {}

  createToken = async (username: string): Promise<string> => {
    const payload = { username };
    const { JWT_SECRET, JWT_ISSUER, JWT_EXPIRES_IN } = serverConfig();
    const options = {
      jwtid: uuid(),
      issuer: JWT_ISSUER,
      expiresIn: JWT_EXPIRES_IN,
    };

    const { success, result, error } = await this.model.create(
      payload,
      JWT_SECRET,
      options,
    );

    if (!success || !result) {
      throw new InternalServerError(error?.message);
    }
    return result;
  };

  deleteToken = async (username: string): Promise<boolean> => {
    const { success, error } = await this.model.delete(username);

    if (!success) {
      throw new InternalServerError(error?.message);
    }
    return success;
  };
}

export default TokensService;
