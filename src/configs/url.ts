import appRoot from 'app-root-path';
import path from 'path';

const urlConfig = () => {
  const LOG_OUTPUT_PATH = path.resolve(appRoot.toString(), 'logs');

  return {
    LOG_OUTPUT_PATH,
  };
};

export default urlConfig;
