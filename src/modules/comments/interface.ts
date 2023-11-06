import { DocumentType } from '@typegoose/typegoose';
import { CommentEntity } from './entity.js';
import { CreateCommentDto } from './dto.js';

export interface CommentServiceInterface {
  create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;

  findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[] | null>;
}
