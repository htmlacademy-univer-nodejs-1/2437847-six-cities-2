import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { CommentServiceInterface } from './interface.js';
import { AppComponents } from '../../types/app-components.js';
import CommentService from './service.js';
import { CommentEntity, CommentModel } from './entity.js';
import CommentController from './controller.js';
import { ControllerInterface } from '../../rest/controller/controller.interface';

export function createCommentContainer() {
  const commentContainer = new Container();

  commentContainer
    .bind<CommentServiceInterface>(AppComponents.CommentServiceInterface)
    .to(CommentService)
    .inSingletonScope();

  commentContainer.bind<types.ModelType<CommentEntity>>(AppComponents.CommentModel).toConstantValue(CommentModel);
  commentContainer.bind<ControllerInterface>(AppComponents.CommentController).to(CommentController).inSingletonScope();
  return commentContainer;
}
