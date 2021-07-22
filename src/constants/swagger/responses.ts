const Responses = {
  BadRequest: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Bad Request' },
          message: {
            type: 'string',
            example:
              'Request parameters (path, query, body, header, ...) are invalid',
          },
        },
      },
    },
  },
  Unauthorized: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Unauthorized' },
          message: {
            type: 'string',
            example: 'Request does not contain a valid access token',
          },
        },
      },
    },
  },
  Forbidden: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Forbidden' },
          message: {
            type: 'string',
            example: 'User does not have privilege to access',
          },
        },
      },
    },
  },
  NotFound: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Not Found' },
          message: {
            type: 'string',
            example: 'Requested resource does not exist',
          },
        },
      },
    },
  },
  InternalServer: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          error: { type: 'string', example: 'Internal Server Error' },
          message: {
            type: 'string',
            example: 'Something went wrong',
          },
        },
      },
    },
  },
};

export default Responses;
