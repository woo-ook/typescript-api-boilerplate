import 'reflect-metadata';
import 'source-map-support/register';

import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { urlencoded, json } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import passport from 'passport';

import GlobalRouter from '@/api';
import { databaseConfig, PassportConfig, serverConfig } from '@/configs';
import {
  ENV_LOCAL_PATH,
  ENV_DEVELOPMENT_PATH,
  ENV_PRODUCTION_PATH,
} from '@/constants/paths/env';
import { ErrorHandler, morgan, RateLimiter, Swagger } from '@/middlewares';
import { Database, Logger, l, Server } from '@/modules';
import Securely from '@/utils/Security';

process.on('unhandledRejection', (reason: Error) => {
  throw reason;
});

process.on('uncaughtException', async (error: Error) => {
  await ErrorHandler.shutdownGracefully(error);
});

process.on('SIGINT', async (signal: NodeJS.Signals) => {
  Logger.info(...l('App')(`Received ${signal} from outer scope`));
  await ErrorHandler.shutdownGracefully();
});

process.on('exit', () => {
  Logger.info(...l('App')('Process is exiting...'));
});

switch (process.env.NODE_ENV?.toUpperCase()) {
  case 'PRODUCTION':
    dotenv.config({ path: ENV_PRODUCTION_PATH });
    break;
  case 'DEVELOPMENT':
    dotenv.config({ path: ENV_DEVELOPMENT_PATH });
    break;
  case 'LOCAL':
    dotenv.config({ path: ENV_LOCAL_PATH });
    break;
  case 'DEBUG':
    dotenv.config({ path: ENV_LOCAL_PATH, debug: true });
    break;
  default:
    throw new Error('process.env.NODE_ENV is not set');
}

PassportConfig.config();
Server.attachMiddlewares([
  morgan,
  urlencoded({ extended: false, limit: '1kb' }),
  json({ limit: '1kb' }),
  compression(),
  helmet(Securely.getHelmetOptions()),
  Securely.applyXSSProtectionHeader,
  cors(Securely.getCORSOptions()),
  hpp(),
  passport.initialize(),
  express.static('public'),
]);

if (
  process.env.NODE_ENV === 'development' ||
  process.env.NODE_ENV === 'local'
) {
  Server.attachRecords([Swagger()]);
}

Server.mountRouters([GlobalRouter]);

Server.attachMiddlewares([
  RateLimiter.checkServerBusy,
  ErrorHandler.handleConnectionHeader,
  ErrorHandler.handleDBError,
  ErrorHandler.handleHTTPError,
]);
Server.run(serverConfig());
Database.connect(databaseConfig());
