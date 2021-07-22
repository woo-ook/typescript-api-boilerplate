import mysql from 'mysql2/promise';

import Logger, { l } from '@/modules/Logger';

class Database {
  private static pool: mysql.Pool;
  private constructor() {}

  static connect = async (options: mysql.PoolOptions): Promise<void> => {
    if (Database.pool) {
      throw new Error('Database pool already exists');
    }

    try {
      Database.pool = mysql.createPool(options);
      Database.subscribeListners();
      const conn = Database.pool.getConnection();
      (await conn).ping();
      (await conn).release();

      Logger.info(...l('Database')('Successfully connected to MySQL database'));
    } catch (err) {
      Logger.error(...l('Database')(err));
    }
  };

  static getPool = (): mysql.Pool => {
    if (!Database.pool) {
      throw new Error('Database pool must be established first');
    }

    return Database.pool;
  };

  static disconnect = async (): Promise<void> => {
    try {
      Database.pool.removeAllListeners();
      await Database.pool.end();

      Logger.info(
        ...l('Database')('Successfully disconnected from MySQL database'),
      );
    } catch (err) {
      Logger.error(...l('Database')(err));
    }
  };

  private static subscribeListners = (): void => {
    try {
      Database.pool.on('acquire', (conn) => {
        Logger.debug(`Connection ${conn.threadId} acquired`);
      });

      // Database.pool.on('connection', (conn) => {
      //   conn.query('SET SESSION auto_increment_increment = 1');
      // });

      Database.pool.on('release', (conn) => {
        Logger.debug(`Connection ${conn.threadId} released`);
      });
    } catch (err) {
      Logger.error(...l('Database')(err));
    }
  };
}

export default Database;
