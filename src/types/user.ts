import { UserType } from './enums.js';

export type User = {
  username: string;
  email: string;
  avatar?: string;
  type: UserType;
};
