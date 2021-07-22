import { NextHandleFunction } from 'connect';
import { RequestHandler, ErrorRequestHandler } from 'express';

declare type ErrorHandler = ErrorRequestHandler;
declare type Middleware = NextHandleFunction | RequestHandler | ErrorHandler;
declare type MiddlewareRecord = {
  route: string;
  middlewares: Middleware[];
};

export default Middleware;
export { MiddlewareRecord };
