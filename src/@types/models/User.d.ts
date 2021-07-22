import Datestring from '@/@types/Datestring';

import WILDCARD from '../Wildcard';

declare type User = {
  id: string;
  username: string;
  password: string | null;
  salt: string;
  jwtid: string | null;
  affiliate: string | null;
  login_retries: number;
  locked_flag: boolean;
  init_pw_changed_flag: boolean;
  active: 'Y' | 'N';
  last_authorized_at: Datestring;
  created_at: Datestring;
  updated_at: Datestring;
};

declare type UserKeys =
  | Array<
      | 'id'
      | 'username'
      | 'password'
      | 'salt'
      | 'jwtid'
      | 'affiliate'
      | 'login_retries'
      | 'locked_flag'
      | 'init_pw_changed_flag'
      | 'active'
      | 'last_authorized_at'
      | 'created_at'
      | 'updated_at'
    >
  | WILDCARD;

export default User;
export { UserKeys };
