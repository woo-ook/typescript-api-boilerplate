import fs from 'fs';

import { PoolOptions } from 'mysql2/promise';
import SqlString from 'sqlstring';

import {
  MYSQL80_CA_PEM_PATH,
  MYSQL80_CERT_PEM_PATH,
  MYSQL80_KEY_PEM_PATH,
} from '@/constants/paths/certs';

const databaseConfig = (): PoolOptions => ({
  host: process.env.DB_ENDPOINT,
  port: Number(process.env.DB_PORT),
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync(MYSQL80_CA_PEM_PATH).toString(),
    cert: fs.readFileSync(MYSQL80_CERT_PEM_PATH).toString(),
    key: fs.readFileSync(MYSQL80_KEY_PEM_PATH).toString(),
  },
  multipleStatements: true,
  connectionLimit: 500,
  connectTimeout: 15,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  timezone: '+09:00',
  typeCast: (field, useDefaultTypeCasting) => {
    if (
      field.type === 'NEWDECIMAL' ||
      field.type === 'FLOAT' ||
      field.type === 'DOUBLE'
    ) {
      const value = field.string();

      return value === null ? null : parseFloat(value);
    }
    if (field.type === 'TINY' && field.length === 1) {
      return field.string() === '1';
    }
    if (field.type === 'LONGLONG' && field.length === 1) {
      return field.string() === '1';
    }
    if (field.name === 'laneNumber') {
      const value = field.string();
      if (value === 'ALL') return value;

      return value === null ? null : parseFloat(value);
    }
    return useDefaultTypeCasting();
  },
  supportBigNumbers: true,
  dateStrings: true,
  queryFormat: (query, values) => {
    if (query.includes(':')) {
      return query.replace(/:(\w+)/g, (txt, key) => {
        if (Object.prototype.hasOwnProperty.call(values, key)) {
          const param = values[`${key}`];

          if (
            typeof param === 'string' &&
            ((param.startsWith('(') && param.endsWith(')')) ||
              (param.startsWith('[') && param.endsWith(']')))
          ) {
            return param;
          }

          return typeof param === 'string' ? `"${param}"` : param;
        }
        return txt;
      });
    }
    return SqlString.format(
      query,
      values,
      false, // this.config.stringifyObjects,
      process.env.TIMEZONE,
    );
  },
});

export default databaseConfig;
