import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { AppComponents } from '../../types/appComponents.js';
import { OfferEntity, OfferModel } from './entity.js';
import { OfferServiceInterface } from './interface.js';
import OfferService from './service.js';

export function createOfferContainer() {
  const userContainer = new Container();
  userContainer.bind<OfferServiceInterface>(AppComponents.UserServiceInterface).to(OfferService).inSingletonScope();
  userContainer.bind<types.ModelType<OfferEntity>>(AppComponents.UserModel).toConstantValue(OfferModel);

  return userContainer;
}
