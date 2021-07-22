import IRoute from '@/@types/interfaces/IRoute';
import Authenticate from '@/middlewares/Authenticator';

import Controller from './Tokens.controller';
import Validate from './Tokens.validator';

/**
 * @swagger
 * /api/auth/tokens:
 *  post:
 *    tags: [auth]
 *    summary: Create access token using user credentials
 *    consumes:
 *      - application/json
 *    requestBody:
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            $ref: '#/components/schemas/LoginCredentials'
 *      description: User login credentials (username and password) in request body (`application/x-www-form-urlencoded`) format. `Username` must be at least 6 and at most 16 alphanumeric characters long. `Password` must be at least 8 characters long, contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special characters. Must be in RSA-public-key-encrypted format (must not be raw). Password is not validated in server.
 *    responses:
 *      201:
 *        description: Login is successful. Returns an access token (JSON Web Token) in JSON format. Resets a number of login retries of a user.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/JWT'
 *      400:
 *        description: Bad Request Error. Username does not exist or invalid parameters are provided.
 *        content:
 *          $ref: '#/components/responses/BadRequest'
 *      401:
 *        description: Unauthorized Error. Incorrect password.
 *        content:
 *          $ref: '#/components/responses/Unauthorized_auth'
 *      403:
 *        description: Forbidden Error. User account is locked, please contact admin.
 *        content:
 *          $ref: '#/components/responses/Forbidden_auth'
 *      500:
 *        description: Internal Server Error. Something went wrong, please contact developers.
 *        content:
 *          $ref: '#/components/responses/InternalServer'
 */

class TokensRoute extends IRoute {
  constructor() {
    super('/tokens');
    this.useRoutes();
  }

  useRoutes = () => {
    this.router
      .post(
        '/',
        Validate.credentials,
        Authenticate.userLocally,
        Controller.issueJWT,
      )
      .delete('/', Authenticate.userWithJWT, Controller.deleteJWT);
  };
}

export default new TokensRoute();
