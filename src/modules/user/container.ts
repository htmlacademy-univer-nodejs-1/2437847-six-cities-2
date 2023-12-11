import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { UserServiceInterface } from './interface.js';
import { AppComponents } from '../../types/appComponents.js';
import { UserEntity, UserModel } from './entity.js';
import UserController from './controller.js';
import { BaseController } from '../../rest/controller/baseController.js';
import UserService from './service.js';

export function createUserContainer() {
  const userContainer = new Container();
  userContainer.bind<UserServiceInterface>(AppComponents.UserServiceInterface).to(UserService).inSingletonScope();
  userContainer.bind<types.ModelType<UserEntity>>(AppComponents.UserModel).toConstantValue(UserModel);
  userContainer.bind<BaseController>(AppComponents.UserController).to(UserController).inSingletonScope();

  return userContainer;
}
