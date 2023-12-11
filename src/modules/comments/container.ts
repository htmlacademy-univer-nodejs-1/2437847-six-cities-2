import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { CommentServiceInterface } from './interface.js';
import { AppComponents } from '../../types/appComponents.js';
import CommentService from './service.js';
import { CommentEntity, CommentModel } from './entity.js';

export function createCommentContainer() {
  const commentContainer = new Container();

  commentContainer
    .bind<CommentServiceInterface>(AppComponents.CommentServiceInterface)
    .to(CommentService)
    .inSingletonScope();

  commentContainer.bind<types.ModelType<CommentEntity>>(AppComponents.CommentModel).toConstantValue(CommentModel);
  return commentContainer;
}
