import morgan, { StreamOptions } from 'morgan';

import { l, Logger } from '@/modules';

const stream: StreamOptions = {
  write: (message) =>
    Logger.http(
      ...l('Server')(message.substring(0, message.lastIndexOf('\n'))),
    ),
};

const morganMiddleware = morgan(
  ':status :method :url - :response-time ms ~ :res[content-length] ":referrer" ":user-agent"',
  { stream },
);

export default morganMiddleware;
