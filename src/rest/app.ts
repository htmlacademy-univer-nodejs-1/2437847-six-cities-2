import { LoggerInterface } from '../core/logger/logger.interface.js';
import { ConfigInterface } from '../core/config/config.interface.js';
import { RestSchema } from '../core/config/rest.schema.js';
import { AppComponents } from '../types/appComponents.js';
import { inject, injectable } from 'inversify';
import { getMongoConnectionString } from '../core/helpers/db.js';
import { DatabaseClientInterface } from '../core/db.client/db.interface.js';
import express, { Express } from 'express';
import { ExceptionFilterInterface } from './exceptions/exeptionFilter.interface';
import { BaseController } from './controller/baseController.js';
import { AuthenticateMiddleware } from './middleware/authenticate.js';

@injectable()
export default class Application {
  private server: Express;

  constructor(
    @inject(AppComponents.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponents.ConfigInterface) private readonly config: ConfigInterface<RestSchema>,
    @inject(AppComponents.DatabaseClientInterface) private readonly databaseClient: DatabaseClientInterface,
    @inject(AppComponents.ExceptionFilterInterface) private readonly exceptionFilter: ExceptionFilterInterface,
    @inject(AppComponents.UserController) private readonly userController: BaseController,
    @inject(AppComponents.OfferController) private readonly offerController: BaseController,
  ) {
    this.server = express();
  }

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

  private async _initServer() {
    const port = this.config.get('PORT');
    this.server.listen(port);
  }

  private async _initMiddlewares() {
    this.server.use(express.json());
    const authenticateMiddleware = new AuthenticateMiddleware(this.config.get('JWT_SECRET'));
    this.server.use(authenticateMiddleware.execute.bind(authenticateMiddleware));
  }

  private async _initExceptionFilters() {
    this.server.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }

  private async _initRoutes() {
    this.server.use('/offers', this.offerController.router);
    this.server.use('/users', this.userController.router);
    this.server.use('/upload', express.static(this.config.get('UPLOAD_DIRECTORY')));
  }

  public async init() {
    this.logger.info('Application initialization');

    this.logger.info('Init database...');
    await this._initDatabase();
    this.logger.info('Init database completed');

    this.logger.info('Try to init server...');
    await this._initRoutes();
    await this._initMiddlewares();
    await this._initExceptionFilters();
    await this._initServer();
    this.logger.info(`🚀 Server started on http://localhost:${this.config.get('PORT')}`);
  }
}
