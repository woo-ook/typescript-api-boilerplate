import { QueryError } from 'mysql';

import BaseError from './BaseError';

class DBError extends BaseError implements QueryError {
  constructor(
    readonly code: string,
    readonly sqlState: string,
    readonly sqlMessage: string,
    readonly errno: number,
    readonly fatal = false,
    readonly name = 'Database Error',
  ) {
    super(name, sqlMessage, undefined, { code, sqlState, errno });
  }
}

export default DBError;
