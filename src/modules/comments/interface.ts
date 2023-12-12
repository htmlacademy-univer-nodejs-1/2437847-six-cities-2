import { DocumentType } from '@typegoose/typegoose';
import { CommentEntity } from './entity.js';
import { CreateCommentRequest } from './dto.js';

export interface CommentServiceInterface {
  createForOffer(dto: CreateCommentRequest): Promise<DocumentType<CommentEntity>>;
  findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]>;
  deleteByOfferId(offerId: string): Promise<number | null>;
}
