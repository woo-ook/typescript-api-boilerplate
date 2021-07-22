interface IServerConfig {
  MODE: string;
  SERVER_IP: string;
  PROTOCOL: string;
  SERVER_PORT: number;
  JWT_SECRET: string;
  JWT_ISSUER: string;
  JWT_EXPIRES_IN: string;
  DEFAULT_PW: string;
}

export default IServerConfig;
