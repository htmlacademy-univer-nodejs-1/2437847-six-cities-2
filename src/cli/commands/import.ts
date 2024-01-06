import { ICliCommand } from './interfaces/сli-command.interface.js';
import chalk from 'chalk';
import { FileReader } from '../../core/file/file.service.js';
import { Offer } from '../../types/offer.js';
import OfferService from '../../modules/offer/service.js';
import { OfferModel } from '../../modules/offer/entity.js';
import UserService from '../../modules/user/service.js';
import { LoggerInterface } from '../../core/logger/logger.interface.js';
import { DatabaseClientInterface } from '../../core/db.client/db.interface.js';
import { OfferServiceInterface } from '../../modules/offer/interface.js';
import { UserServiceInterface } from '../../modules/user/interface.js';
import { UserModel } from '../../modules/user/entity.js';
import MongoClientService from '../../core/db.client/mongo.service.js';
import ConsoleService from '../../core/logger/console.serivce.js';
import { ConfigInterface } from '../../core/config/config.interface.js';
import { RestSchema } from '../../core/config/rest.schema.js';
import ConfigService from '../../core/config/config.service.js';
import { parseOffer } from '../../core/helpers/offers.js';

const DEFAULT_USER_PASSWORD = '123456';

export default class ImportCommand implements ICliCommand {
  public readonly name = '--import';

  private readonly userService: UserServiceInterface;
  private readonly offerService: OfferServiceInterface;
  private readonly databaseService: DatabaseClientInterface;
  private readonly logger: LoggerInterface;
  private readonly config: ConfigInterface<RestSchema>;

  constructor() {
    this.logger = new ConsoleService();
    this.config = new ConfigService(this.logger);
    this.offerService = new OfferService(this.logger, OfferModel);
    this.userService = new UserService(this.logger, this.config, UserModel);
    this.databaseService = new MongoClientService(this.logger);
  }

  public async execute(filename: string, connectionString: string): Promise<void> {
    await this.databaseService.connect(connectionString);
    try {
      this.readOffers(filename.trim()).then((count: number) => {
        this.logger.info(`File ${chalk.blueBright(filename)} was successfully read. ${count} offers were imported`);
      });
    } catch (err) {
      this.logger.error(`${chalk.redBright(`ERROR! Can't read the file: ${(err as Error).message}`)}`);
    }
  }

  private async readOffers(filename: string): Promise<number> {
    const fileReader = new FileReader(filename.trim());
    let count = 0;

    for await (const offer of fileReader.read()) {
      await this.saveOffer(parseOffer(offer));
      count++;
    }

    return count;
  }

  private async saveOffer(offer: Offer) {
    const user = await this.userService.findOrCreate({
      ...offer.userId,
      password: DEFAULT_USER_PASSWORD,
    });

    await this.offerService.create({
      ...offer,
      userId: user.id,
    });
  }
}
