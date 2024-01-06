import 'reflect-metadata';
import { Container } from 'inversify';
import Application from './rest/app.js';
import { AppComponents } from './types/app-components.js';
import { createRestApplicationContainer } from './rest/container.js';
import { createUserContainer } from './modules/user/container.js';
import { createOfferContainer } from './modules/offer/container.js';
import { createCommentContainer } from './modules/comments/container.js';

async function bootstrap() {
  const container = Container.merge(
    createRestApplicationContainer(),
    createUserContainer(),
    createOfferContainer(),
    createCommentContainer(),
  );

  const application = container.get<Application>(AppComponents.Application);
  await application.init();
}

bootstrap();
