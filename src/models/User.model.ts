import { Service } from 'typedi';

import {
  QueryResult,
  ActionResult,
  OkPacket,
  RowDataPacket,
} from '@/@types/DBResults';
import User, { UserKeys } from '@/@types/models/User';
import {
  Q_GET_PARTIAL_BY_USERNAME,
  Q_UPDATE_PARTIAL_BY_USERNAME,
} from '@/constants/queries/molds/users';

import { InternalServerError } from '@/@types/errors/HTTPErrors';
import Database from '@/modules/Database';

@Service()
class UserModel {
  findByUsername = async (
    props: UserKeys,
    username: string,
  ): Promise<ActionResult<Partial<User>>> => {
    try {
      const pool = Database.getPool();
      const query = Q_GET_PARTIAL_BY_USERNAME(props, username);
      const [[result]]: QueryResult<RowDataPacket[]> = await pool.query(query);

      const userDTO: { [index: string]: UserKeys } = {};
      for (let i = 0; i < result.length; i += 1) {
        const key = props[i];
        const value = result[`${key}`];
        userDTO[`${key}`] = value;
      }

      return { success: true, result: userDTO };
    } catch (e) {
      return { success: false, error: e };
    }
  };

  updateOneByUsername = async (
    props: Partial<User>,
    username: string,
  ): Promise<ActionResult> => {
    try {
      const pool = Database.getPool();
      const query = Q_UPDATE_PARTIAL_BY_USERNAME(props, username);
      const [{ affectedRows }]: QueryResult<OkPacket> = await pool.query(query);

      if (affectedRows === 0) {
        throw new InternalServerError('Failed to partially update user');
      }

      return { success: true };
    } catch (e) {
      return { success: false, error: e };
    }
  };

  disableOneByUsername = async (username: string): Promise<ActionResult> => {
    try {
      const pool = Database.getPool();
      const query = Q_UPDATE_PARTIAL_BY_USERNAME({ active: 'N' }, username);
      const [{ affectedRows }]: QueryResult<OkPacket> = await pool.query(query);

      if (affectedRows === 0) {
        throw new InternalServerError('Failed to disable user');
      }

      return { success: true };
    } catch (e) {
      return { success: false, error: e };
    }
  };
}

export default UserModel;
