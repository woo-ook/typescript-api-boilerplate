const Username = {
  type: 'string',
  example: 'master',
  description:
    'An alphanumeric username to use as credential. Must be at least 6 and at most 16 characters long.',
  minLength: 6,
  maxLength: 16,
  pattern: '^\\w{6,16}$',
};

const Password = {
  type: 'string',
  description:
    'An alphanumeric password of length at least 8. Must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special characters. Must be in RSA-public-key-encrypted format (must not be raw).',
  example:
    'ImJjZEXtAsBbe0mZHcHlXCdO4YvN1PC1cnvH64MK8Ob2gPczOoLGRWhGh44YmJ5BPGwaWCCaxi274jSds4/ulgcm1bn0r1aQkzUOhLxcLY4d4F0d1ub0mWUZVIBo7jQl86xYPLSegOAFQMnLAWjpSTrFxEIiiHFDEwwtogVtSq0=',
  minLength: 8,
  maxLength: 128,
  pattern:
    '^(?=.{8,128})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[-#!$@%^&*()_+|~=`{}[]:";\'<>?,./ ]).*$',
};

const JWT = {
  type: 'object',
  properties: {
    jwt: {
      type: 'string',
      description:
        'An access code (JSON Web Token) bound to the user logged in',
      example:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hc3RlciIsImlhdCI6MTYyMzMwNDA1NiwiZXhwIjoxNjIzOTA4ODU2LCJpc3MiOiJnbG9iYWxicmlkZ2UuY29tIiwianRpIjoiODU4NzAxNzEtNDEyOC00NTUyLWI4MTQtOGZhOWNjYTVlM2IxIn0.TywYTw8zSEgdX8y4VI_KG3SN_2AQP8uHjZN5VxqZN6c',
    },
  },
};

const LoginCredentials = {
  type: 'object',
  required: ['username', 'password'],
  properties: {
    username: Username,
    password: Password,
  },
};

const PWChangeCredentials = {
  type: 'object',
  required: ['username', 'oldPassword', 'newPassword'],
  properties: {
    username: Username,
    oldPassword: Password,
    newPassword: Password,
  },
};

export default {
  Username,
  Password,
  JWT,
  LoginCredentials,
  PWChangeCredentials,
};
