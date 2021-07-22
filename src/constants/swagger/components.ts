import Responses from './responses';
import Schemas from './schemas';

const Components = {
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
  },
  schemas: Schemas,
  responses: Responses,
};

export default Components;
