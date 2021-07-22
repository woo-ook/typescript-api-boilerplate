import appRoot from 'app-root-path';
import path from 'path';

export const ENV_LOCAL_PATH = path.resolve(
  appRoot.toString(),
  'envs/.env.local',
);
export const ENV_DEVELOPMENT_PATH = path.resolve(
  appRoot.toString(),
  'envs/.env.development',
);
export const ENV_PRODUCTION_PATH = path.resolve(
  appRoot.toString(),
  'envs/.env.production',
);
