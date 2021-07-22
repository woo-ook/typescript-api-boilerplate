import IRoute from '@/@types/interfaces/IRoute';

import Tokens from '@/api/auth/tokens';

class AuthRoute extends IRoute {
  constructor() {
    super('/auth');
    this.useRoutes();
  }

  useRoutes = () => {
    this.router.use(Tokens.route, Tokens.router);
  };
}

export default new AuthRoute();
