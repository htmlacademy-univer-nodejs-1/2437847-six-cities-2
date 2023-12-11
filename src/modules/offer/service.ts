import { inject, injectable } from 'inversify';
import { CreateUpdateOfferDto } from './dto.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { OfferEntity } from './entity.js';
import { OfferServiceInterface } from './interface.js';
import { AppComponents } from '../../types/appComponents.js';
import { LoggerInterface } from '../../core/logger/logger.interface.js';

const MAX_OFFERS_COUNT = 60;
const MAX_PREMIUM_OFFERS_COUNT = 10;
const SORT_DESC = -1;

@injectable()
export default class OfferService implements OfferServiceInterface {
  constructor(
    @inject(AppComponents.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponents.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
  ) {}

  public async create(dto: CreateUpdateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(offerId).exec();
  }

  public async updateById(offerId: string, dto: CreateUpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndUpdate(offerId, dto, { new: true }).populate('userId').exec();
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    // await this.commentService.deleteByOfferId(offerId);
    return this.offerModel.findByIdAndDelete(offerId).exec();
  }

  public async find(count: number | undefined): Promise<DocumentType<OfferEntity>[]> {
    const limit = count ?? MAX_OFFERS_COUNT;
    return this.offerModel.find().sort({ createdAt: SORT_DESC }).populate('author').limit(limit).exec();
  }

  public async findPremiumByCity(city: string): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({ city: city, isPremium: true })
      .sort({ createdAt: SORT_DESC })
      .limit(MAX_PREMIUM_OFFERS_COUNT)
      .populate('author')
      .exec();
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
