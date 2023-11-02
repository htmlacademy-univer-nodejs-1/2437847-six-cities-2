import { LoggerInterface } from '../core/logger/logger.interface.js';
import { ConfigInterface } from '../core/config/config.interface.js';
import { RestSchema } from '../core/config/rest.schema.js';
import { AppComponents } from '../types/appComponents.js';
import { inject, injectable } from 'inversify';
import { getMongoConnectionString } from '../core/helpers/db.js';
import { DatabaseClientInterface } from '../core/db.client/db.interface.js';

@injectable()
export default class Application {
  constructor(
    @inject(AppComponents.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponents.ConfigInterface) private readonly config: ConfigInterface<RestSchema>,
    @inject(AppComponents.DatabaseClientInterface) private readonly databaseClient: DatabaseClientInterface,
  ) {}

  private async _initDatabase() {
    const connectionString = getMongoConnectionString(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    return this.databaseClient.connect(connectionString);
  }

  public async init() {
    this.logger.info('Application initialization...');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);

    this.logger.info('Init database...');
    await this._initDatabase();
    this.logger.info('Init database completed');
  }
}
