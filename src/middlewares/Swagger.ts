/* eslint-disable import/no-extraneous-dependencies */
import swaggereJsdoc, { SwaggerDefinition } from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';

import { serverConfig } from '@/configs';
import { Components, Info } from '@/constants/swagger';

const getDefinition = (IP: string, PORT: number): SwaggerDefinition => ({
  openapi: '3.0.0',
  info: Info,
  host: `${IP}:${PORT}`,
  basePath: '/api',
  schemas: ['http'],
  components: Components,
});

const options = () => {
  const { SERVER_IP, SERVER_PORT } = serverConfig();
  const swaggerDefinition = getDefinition(SERVER_IP, SERVER_PORT);

  return {
    apis: ['src/**/*.ts'],
    swaggerDefinition,
  };
};

const Swagger = () => {
  const swaggerSpec = swaggereJsdoc(options());

  return {
    route: '/api-docs',
    middlewares: [...swaggerUI.serve, swaggerUI.setup(swaggerSpec)],
  };
};

export default Swagger;
