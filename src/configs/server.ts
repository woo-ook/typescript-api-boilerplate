import IServerConfig from '@/@types/interfaces/IServerConfig';

const serverConfig = (): IServerConfig => ({
  MODE: String(process.env.NODE_ENV),
  PROTOCOL: String(process.env.PROTOCOL),
  SERVER_IP: String(process.env.SERVER_IP),
  SERVER_PORT:
    process.env.PROTOCOL === 'https'
      ? Number(process.env.SERVER_HTTPS_PORT)
      : Number(process.env.SERVER_HTTP_PORT),
  JWT_SECRET: String(process.env.JWT_SECRET),
  JWT_ISSUER: String(process.env.JWT_ISSUER),
  JWT_EXPIRES_IN: String(process.env.JWT_EXPIRES_IN),
  DEFAULT_PW: String(process.env.DEFAULT_PW),
});

export default serverConfig;
