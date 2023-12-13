import { inject, injectable } from 'inversify';
import { OfferServiceInterface } from './interface.js';
import { LoggerInterface } from '../../core/logger/logger.interface';
import { DocumentType, types } from '@typegoose/typegoose';
import { OfferEntity } from './entity.js';
import { AppComponents } from '../../types/appComponents.js';
import { CreateOfferRequest, UpdateOfferRequest } from './dto.js';
import { SortType } from '../common/types.js';

const MAX_PREMIUM_OFFERS_COUNT = 3;
const MAX_OFFERS_COUNT = 60;
@injectable()
export default class OfferService implements OfferServiceInterface {
  constructor(
    @inject(AppComponents.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponents.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
  ) {}

  public async create(dto: CreateOfferRequest): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer was created: ${dto.name}`);
    return result;
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndDelete(offerId).exec();
  }

  public async find(count: number | undefined): Promise<DocumentType<OfferEntity>[]> {
    const limit = count ?? MAX_OFFERS_COUNT;
    return this.offerModel.find().sort({ createdAt: SortType.DESCENDING }).populate('userId').limit(limit).exec();
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(offerId).populate('userId').exec();
  }

  public async findPremiumByCity(city: string): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({ city: city, premium: true })
      .sort({ createdAt: SortType.DESCENDING })
      .limit(MAX_PREMIUM_OFFERS_COUNT)
      .populate('userId')
      .exec();
  }

  incComment(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, {
        $inc: {
          commentsCount: 1,
        },
      })
      .exec();
  }

  public async updateById(offerId: string, dto: UpdateOfferRequest): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndUpdate(offerId, dto, { new: true }).populate('userId').exec();
  }

  public async updateRating(offerId: string, rating: number): Promise<void> {
    await this.offerModel.findByIdAndUpdate(offerId, { rating: rating }, { new: true }).exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel.exists({ _id: documentId })) !== null;
  }
}
