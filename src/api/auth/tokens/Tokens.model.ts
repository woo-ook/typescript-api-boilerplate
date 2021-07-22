import jwt from 'jsonwebtoken';

import { Service } from 'typedi';

import { ActionResult, QueryResult, OkPacket } from '@/@types/DBResults';
import { Q_UPDATE_PARTIAL_BY_USERNAME } from '@/constants/queries/molds/users';
import { InternalServerError } from '@/@types/errors/HTTPErrors';
import Database from '@/modules/Database';

@Service()
class TokensModel {
  create = async (
    payload: Record<string, unknown>,
    secret: jwt.Secret,
    options: jwt.SignOptions,
  ): Promise<ActionResult<string>> => {
    try {
      const pool = Database.getPool();
      const token = jwt.sign(payload, secret, options);
      const query = Q_UPDATE_PARTIAL_BY_USERNAME(
        { jwtid: options.jwtid },
        <string>payload.username,
      );

      const [{ affectedRows }]: QueryResult<OkPacket> = await pool.query(query);

      if (affectedRows === 0) {
        throw new InternalServerError('Failed to insert jwtid');
      }

      return { success: true, result: token };
    } catch (e) {
      return { success: false, error: e };
    }
  };

  delete = async (username: string): Promise<ActionResult> => {
    try {
      const pool = Database.getPool();
      const query = Q_UPDATE_PARTIAL_BY_USERNAME({ jwtid: null }, username);
      const [{ affectedRows }]: QueryResult<OkPacket> = await pool.query(query);

      if (affectedRows === 0) {
        throw new InternalServerError('Failed to clear jwtid');
      }

      return { success: true };
    } catch (e) {
      return { success: false, error: e };
    }
  };
}

export default TokensModel;
