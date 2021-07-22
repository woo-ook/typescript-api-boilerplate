import appRoot from 'app-root-path';
import path from 'path';

export const MYSQL80_CA_PEM_PATH = path.resolve(
  appRoot.toString(),
  'certs/mysql/ca.pem',
);
export const MYSQL80_CERT_PEM_PATH = path.resolve(
  appRoot.toString(),
  'certs/mysql/client-cert.pem',
);
export const MYSQL80_KEY_PEM_PATH = path.resolve(
  appRoot.toString(),
  'certs/mysql/client-key.pem',
);

export const HTTPS_CA_PEM_PATH = path.resolve(
  appRoot.toString(),
  'certs/https/ca.pem',
);
export const HTTPS_CERT_PEM_PATH = path.resolve(
  appRoot.toString(),
  'certs/https/cert.pem',
);
export const HTTPS_KEY_PEM_PATH = path.resolve(
  appRoot.toString(),
  'certs/https/key.pem',
);

/* ----- < For RSA Cert > ----- */
export const RSA_PUBLIC_PEM_PATH = path.resolve(
  appRoot.toString(),
  'certs/rsa/public.pem',
);

export const RSA_PRIVATE_PEM_PATH = path.resolve(
  appRoot.toString(),
  'certs/rsa/private.pem',
);
/* ---------------------------- */
