import { Container } from 'inversify';
import { LoggerInterface } from '../core/logger/logger.interface.js';
import PinoService from '../core/logger/pino.service.js';
import { ConfigInterface } from '../core/config/config.interface.js';
import { RestSchema } from '../core/config/rest.schema.js';
import ConfigService from '../core/config/config.service.js';
import { DatabaseClientInterface } from '../core/db.client/db.interface.js';
import MongoClientService from '../core/db.client/mongo.service.js';
import { AppComponents } from '../types/app-components.js';
import Application from './app.js';
import ExceptionFilter from './exceptions/exception-filter.js';
import { ExceptionFilterInterface } from './exceptions/exeption-filter.interface';

export function createRestApplicationContainer() {
  const container = new Container();
  container.bind<Application>(AppComponents.Application).to(Application).inSingletonScope();
  container.bind<LoggerInterface>(AppComponents.LoggerInterface).to(PinoService).inSingletonScope();
  container.bind<ConfigInterface<RestSchema>>(AppComponents.ConfigInterface).to(ConfigService).inSingletonScope();
  container
    .bind<DatabaseClientInterface>(AppComponents.DatabaseClientInterface)
    .to(MongoClientService)
    .inSingletonScope();
  container
    .bind<ExceptionFilterInterface>(AppComponents.ExceptionFilterInterface)
    .to(ExceptionFilter)
    .inSingletonScope();

  return container;
}
