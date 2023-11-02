import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { UserServiceInterface } from './interface.js';
import { AppComponents } from '../../types/appComponents.js';
import Service from './service.js';
import { UserEntity, UserModel } from './entity.js';

export function createUserContainer() {
  const userContainer = new Container();
  userContainer.bind<UserServiceInterface>(AppComponents.UserServiceInterface).to(Service).inSingletonScope();
  userContainer.bind<types.ModelType<UserEntity>>(AppComponents.UserModel).toConstantValue(UserModel);

  return userContainer;
}
