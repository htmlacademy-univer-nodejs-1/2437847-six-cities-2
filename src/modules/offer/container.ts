import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { AppComponents } from '../../types/app-components.js';
import { OfferEntity, OfferModel } from './entity.js';
import { OfferServiceInterface } from './interface.js';
import OfferService from './service.js';
import OfferController from './controller.js';
import { BaseController } from '../../rest/controller/base-controller.js';

export function createOfferContainer() {
  const offerController = new Container();
  offerController.bind<OfferServiceInterface>(AppComponents.OfferServiceInterface).to(OfferService).inSingletonScope();
  offerController.bind<types.ModelType<OfferEntity>>(AppComponents.OfferModel).toConstantValue(OfferModel);
  offerController.bind<BaseController>(AppComponents.OfferController).to(OfferController).inSingletonScope();

  return offerController;
}
