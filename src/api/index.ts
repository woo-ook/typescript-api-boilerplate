import IRoute from '@/@types/interfaces/IRoute';

import Auth from '@/api/auth';

import Controller from './API.controller';

class APIRoute extends IRoute {
  constructor() {
    super('/api');
    this.useRoutes();
  }

  useRoutes = (): void => {
    this.router.use(Auth.route, Auth.router);
    this.router.use('*', Controller.disallowRequest);
  };
}

export default new APIRoute();
