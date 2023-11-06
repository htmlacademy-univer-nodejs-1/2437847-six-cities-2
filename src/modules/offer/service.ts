import { inject, injectable } from 'inversify';
import { CreateOfferDto } from './dto.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { OfferEntity } from './entity.js';
import { OfferServiceInterface } from './interface.js';
import { AppComponents } from '../../types/appComponents.js';
import { LoggerInterface } from '../../core/logger/logger.interface.js';

@injectable()
export default class OfferService implements OfferServiceInterface {
  constructor(
    @inject(AppComponents.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponents.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(offerId).exec();
  }

  public async incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, {
        $inc: {
          commentCount: 1,
        },
      })
      .exec();
  }

  public async addRating(offerId: string, rating: number): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, {
        $inc: {
          ratingNumerator: rating,
          ratingDenominator: 1,
        },
      })
      .exec();
  }
}
