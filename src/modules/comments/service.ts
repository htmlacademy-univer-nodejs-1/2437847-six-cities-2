import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { CommentServiceInterface } from './interface.js';
import { CommentEntity } from './entity.js';
import { CreateCommentRequest } from './dto.js';
import { OfferServiceInterface } from '../offer/interface.js';
import { AppComponents } from '../../types/app-components.js';
import { SortType } from '../common/types.js';

const COMMENTS_COUNT = 50;
@injectable()
export default class CommentService implements CommentServiceInterface {
  constructor(
    @inject(AppComponents.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(AppComponents.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
  ) {}

  public async createForOffer(dto: CreateCommentRequest): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);
    const offerId = dto.offerId;
    await this.offerService.incComment(offerId);

    const allRating = this.commentModel.find({ offerId }).select('rating');
    const offer = await this.offerService.findById(offerId);

    const count = offer?.commentsCount ?? 1;
    const newRating = allRating['rating'] / count;
    await this.offerService.updateRating(offerId, newRating);
    return comment.populate('authorId');
  }

  public async findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .find({ offerId })
      .sort({ createdAt: SortType.DESCENDING })
      .populate('authorId')
      .limit(COMMENTS_COUNT);
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel.deleteMany({ offerId }).exec();

    return result.deletedCount;
  }
}
