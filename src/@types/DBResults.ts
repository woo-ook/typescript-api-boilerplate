import { FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } from 'mysql2';

import DBError from './errors/DBErrors';

type Mutation = OkPacket | OkPacket[] | ResultSetHeader;
type Fetch = RowDataPacket | RowDataPacket[] | RowDataPacket[][];
type QueryResult<T extends Mutation | Fetch> = [T, FieldPacket[]];

interface ActionResult<T = any> {
  success: boolean;
  result?: T;
  error?: DBError;
}

export { ActionResult, QueryResult, OkPacket, RowDataPacket };
