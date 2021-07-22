import { Router } from 'express';

interface IRouteRecord {
  route: string;
  router: Router;
}

abstract class IRoute implements IRouteRecord {
  readonly route: string;
  readonly router: Router;
  constructor(path: string, routerOption?: Record<string, unknown>) {
    this.route = path;
    this.router = Router(routerOption);
  }

  abstract useRoutes: () => void;
}

export default IRoute;
export { IRouteRecord };
