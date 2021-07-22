import { Request, Response } from 'express';

interface ICacheConfig {
  REALTIME: string;
  REGULAR: string;
  CONSTANT: string;
}

const cacheConfig: ICacheConfig = {
  REALTIME: '1 minute',
  REGULAR: '5 minutes',
  CONSTANT: '1 hour',
};

const on200 = (req: Request, res: Response): boolean => res.statusCode === 200;
const on201 = (req: Request, res: Response): boolean => res.statusCode === 201;
const on204 = (req: Request, res: Response): boolean => res.statusCode === 204;

export default cacheConfig;
export { on200, on201, on204 };
