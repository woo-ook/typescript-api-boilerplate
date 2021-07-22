/* eslint-disable @typescript-eslint/naming-convention */
import moment from 'moment-timezone';
import passport from 'passport';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import { Service, Container } from 'typedi';

import serverConfig from '@/configs/server';

import {
  ForbiddenError,
  InternalServerError,
  UnauthorizedError,
} from '@/@types/errors/HTTPErrors';
import UserModel from '@/models/User.model';
import Securely from '@/utils/Security';

@Service()
class Passport {
  constructor(private model: UserModel) {}

  config = (): void => {
    passport.use(
      new LocalStrategy(
        {
          usernameField: 'username',
          passwordField: 'password',
        },
        async (username: string, password: string, done) => {
          try {
            const {
              result: userDTO,
              error: credErr,
            } = await this.model.findByUsername('*', username);

            if (!userDTO || credErr) throw credErr;

            const {
              password: userPW,
              salt,
              locked_flag,
              login_retries,
            } = userDTO;

            const hashedPW = Securely.hash(password, <string>salt);
            const authenticated = hashedPW === userPW;

            if (!authenticated) {
              const updateDTO = {
                login_retries: <number>login_retries + 1,
              };
              const { error } = await this.model.updateOneByUsername(
                updateDTO,
                username,
              );

              if (error) throw new InternalServerError(error.message);
              if (locked_flag || <number>login_retries + 1 === 5) {
                throw new ForbiddenError(
                  'User account is locked. Contact admin.',
                );
              }

              throw new UnauthorizedError('Incorrect username or password', {
                loginRetries: <number>login_retries + 1,
                locked_flag,
              });
            }

            const updateDTO = {
              last_authorized_at: moment().format('YYYY-MM-DD HH:mm:ss'),
              login_retries: 0,
            };
            const { error } = await this.model.updateOneByUsername(
              updateDTO,
              username,
            );

            if (error) throw new InternalServerError(error.message);

            return done(null, username);
          } catch (e) {
            return done(e);
          }
        },
      ),
    );

    // JWT Strategy
    passport.use(
      new JWTStrategy(
        {
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          issuer: serverConfig().JWT_ISSUER,
          secretOrKey: serverConfig().JWT_SECRET,
        },
        async (jwtPayload: Record<string, string>, done) => {
          try {
            const { username, jti } = jwtPayload;
            const {
              result: userDTO,
              error: credentialError,
            } = await this.model.findByUsername(['jwtid'], username);

            if (!userDTO) {
              throw credentialError;
            }

            const userJTI = userDTO.jwtid;
            const authorized = jti === userJTI;

            if (!authorized) throw new UnauthorizedError();

            const updateDTO = {
              last_authorized_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            };
            const { error } = await this.model.updateOneByUsername(
              updateDTO,
              username,
            );

            if (error) {
              throw error;
            }
            return done(null, { name: username });
          } catch (e) {
            return done(e);
          }
        },
      ),
    );
  };
}

export default Container.get(Passport);
