import express from 'express';
import fs from 'fs';
import http from 'http';
import https from 'https';

import Middleware, { MiddlewareRecord } from '@/@types/Middleware';
import { IRouteRecord } from '@/@types/interfaces/IRoute';
import IServerConfig from '@/@types/interfaces/IServerConfig';

import {
  HTTPS_CA_PEM_PATH,
  HTTPS_CERT_PEM_PATH,
  HTTPS_KEY_PEM_PATH,
} from '@/constants/paths/certs';

import Logger, { l } from '@/modules/Logger';

class Server {
  private static app: express.Application;
  private static instance: http.Server | https.Server | undefined;
  public static keepAlive = true;

  static attachMiddlewares = (middlewares: Middleware[]): void => {
    Server.app.use(middlewares);
  };

  static attachRecords = (records: MiddlewareRecord[]): void => {
    records.forEach((record) => {
      Server.app.use(record.route, record.middlewares);
    });
  };

  static mountRouters = (routers: IRouteRecord[]): void => {
    routers.forEach((router: IRouteRecord) => {
      Server.app.use(router.route, router.router);
    });

    Server.app.use('*', (req, res) => {
      return res.redirect('/');
    });
  };

  static run = (serverConfig: IServerConfig): void => {
    if (Server.instance) {
      throw new Error('Instance already exists');
    }

    const { SERVER_PORT, SERVER_IP, PROTOCOL, MODE } = serverConfig;
    const mode = MODE.toUpperCase();
    const protocol = PROTOCOL.toUpperCase();

    if (protocol === 'HTTP') {
      Server.instance = http.createServer(Server.app);
    } else if (protocol === 'HTTPS') {
      Server.instance = https.createServer(Server.getHTTPSOption(), Server.app);
    } else {
      throw new Error('process.env.PROTOCOL is neither "http" nor "https"');
    }

    Server.instance.listen(SERVER_PORT, () => {
      if (process.send) {
        process.send('ready');
      }

      setTimeout(() => {
        Logger.info(
          ...l('Server')(
            `Started ${protocol} ${mode} server on ${SERVER_IP}:${SERVER_PORT}`,
          ),
        );
      }, 1000);
    });
  };

  static close = (): void => {
    const { instance } = Server;
    if (!instance) {
      throw new Error('Server instance does not exist');
    }

    Server.keepAlive = false;
    instance.getConnections((_: any, connections: any) => {
      Logger.info(...l('Server')(`Number of connections open: ${connections}`));

      instance.close(() => {
        Logger.info(...l('Server')(`Closing...`));
      });
    });
  };

  static initialize = () => {
    Server.app = express();

    return Server;
  };

  private static getHTTPSOption = (): https.ServerOptions => ({
    ca: fs.readFileSync(HTTPS_CA_PEM_PATH).toString(),
    cert: fs.readFileSync(HTTPS_CERT_PEM_PATH).toString(),
    key: fs.readFileSync(HTTPS_KEY_PEM_PATH).toString(),
  });
}

export default Server.initialize();
