import 'reflect-metadata';
import { Container } from 'inversify';
import PinoService from './core/logger/pino.service.js';
import Application from './rest/app.js';
import ConfigService from './core/config/config.service.js';
import { AppComponents } from './types/appComponents.js';
import { LoggerInterface } from './core/logger/logger.interface.js';
import { ConfigInterface } from './core/config/config.interface.js';
import { RestSchema } from './core/config/rest.schema.js';

async function bootstrap() {
  const container = new Container();
  container.bind<Application>(AppComponents.Application).to(Application).inSingletonScope();
  container.bind<LoggerInterface>(AppComponents.LoggerInterface).to(PinoService).inSingletonScope();
  container.bind<ConfigInterface<RestSchema>>(AppComponents.ConfigInterface).to(ConfigService).inSingletonScope();

  const application = container.get<Application>(AppComponents.Application);
  await application.init();
}

bootstrap();
