import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from '../../rest/controller/baseController.js';
import { LoggerInterface } from '../../core/logger/logger.interface';
import { CommentServiceInterface } from './interface.js';
import { OfferServiceInterface } from '../offer/interface.js';
import { AppComponents } from '../../types/appComponents.js';
import { HttpMethod } from '../../rest/types/httpMethod.js';
import { ValidateDtoMiddleware } from '../../rest/middleware/validateRequest.js';
import CommentResponse, { CreateCommentRequest } from './dto.js';
import { DocumentExistsMiddleware } from '../../rest/middleware/documentExists.js';
import { plainToInstance } from 'class-transformer';
import { PrivateRouteMiddleware } from '../../rest/middleware/privateRoute.js';
import { ParamsOffer } from '../offer/controller.js';

@injectable()
export default class CommentController extends BaseController {
  constructor(
    @inject(AppComponents.LoggerInterface) protected readonly logger: LoggerInterface,
    @inject(AppComponents.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
    @inject(AppComponents.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
  ) {
    super(logger);

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateCommentRequest),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
  }

  public async create({ body, params, user }: Request<ParamsOffer>, res: Response): Promise<void> {
    const comment = await this.commentService.createForOffer({
      ...body,
      offerId: params.offerId,
      userId: user.id,
    });
    this.created(res, plainToInstance(CommentResponse, comment, { excludeExtraneousValues: true }));
  }
}
