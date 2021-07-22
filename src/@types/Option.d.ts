import { PoolOptions } from 'mysql2/promise';

declare type AlarmOptions = {
  TOKEN: string;
  WEBHOOK_URL: string;
};
declare type ServerOptions = {
  MODE: string;
  SERVER_PORT: number;
  SERVER_IP: string;
  PROTOCOL: string;
  JWT_SECRET: string;
  JWT_ISSUER: string;
  JWT_EXPIRES_IN: string;
};
declare type DatabaseOptions = PoolOptions;
declare type URLOptions = {
  LOG_OUTPUT_PATH: string;
  PLAYBACK_STATIC_URI: string;
  PLAYBACK_REQUEST_URL: string;
  PLAYBACK_FOLDER_PATH: string;
  VIDEO_ROOT_PATH: (arg0: string) => string;
  LIVE_M3U8_PATH: (arg0: string) => string;
};
declare type LoggerSource =
  | 'Database'
  | 'Server'
  | 'Middleware'
  | 'App'
  | 'Unexpected';

export {
  AlarmOptions,
  ServerOptions,
  DatabaseOptions,
  URLOptions,
  LoggerSource,
};
