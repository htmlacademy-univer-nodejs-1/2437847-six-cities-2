import { ConfigInterface } from './config.interface.js';
import { LoggerInterface } from '../logger/logger.interface.js';
import { config } from 'dotenv';
import { configRestSchema, RestSchema } from './rest.schema.js';
import { inject, injectable } from 'inversify';
import { AppComponents } from '../../types/app-components.js';

@injectable()
export default class ConfigService implements ConfigInterface<RestSchema> {
  private readonly config: RestSchema;

  constructor(@inject(AppComponents.LoggerInterface) private readonly logger: LoggerInterface) {
    const parsedOutput = config();

    if (parsedOutput.error) {
      throw new Error('Can not read .env file. Perhaps the file does not exists.');
    }

    configRestSchema.load({});
    configRestSchema.validate({ allowed: 'strict', output: this.logger.info });

    this.config = configRestSchema.getProperties();
    this.logger.info('.env file found and successfully parsed!');
  }

  public get<T extends keyof RestSchema>(key: T): RestSchema[T] {
    return this.config[key];
  }
}
