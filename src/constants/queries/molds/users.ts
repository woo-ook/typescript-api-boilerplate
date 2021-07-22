import User, { UserKeys } from '@/@types/models/User';

export const Q_GET_PARTIAL_BY_USERNAME = (
  props: UserKeys,
  username: string,
): string => `
  SELECT ${props === '*' ? props : props.join(', ')}
  FROM Users
  WHERE username="${username}";`;

export const Q_CREATE_USER = (props: Partial<User>): string => `
  INSERT INTO Users
  SET ${Object.entries(props)
    .map(([k, v]) => `${k}="${v}"`)
    .join(', ')}
  `;

export const Q_UPDATE_PARTIAL_BY_USERNAME = (
  props: Partial<User>,
  username: string,
): string => `
  UPDATE USERS
  SET ${Object.entries(props)
    .map(([k, v]) => `${k}="${v}"`)
    .join(', ')}
  WHERE username="${username}";`;
