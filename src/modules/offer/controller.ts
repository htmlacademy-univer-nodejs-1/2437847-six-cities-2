import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { AppComponents } from '../../types/app-components.js';
import { BaseController } from '../../rest/controller/base-controller.js';
import { LoggerInterface } from '../../core/logger/logger.interface';
import { OfferServiceInterface } from './interface.js';
import { UserServiceInterface } from '../user/interface.js';
import { CommentServiceInterface } from '../comments/interface.js';
import { HttpMethod } from '../../rest/types/http-method.js';
import { ValidateDtoMiddleware } from '../../rest/middleware/validate-request.js';
import { CreateCommentRequest } from '../comments/dto.js';
import { ValidateObjectIdMiddleware } from '../../rest/middleware/validate-object-id.js';
import { DocumentExistsMiddleware } from '../../rest/middleware/document-exists.js';
import { CreateOfferRequest, FavoriteOfferShortResponse, OfferResponse, UpdateOfferRequest } from './dto.js';
import { plainToInstance } from 'class-transformer';
import { ParamsDictionary } from 'express-serve-static-core';
import { PrivateRouteMiddleware } from '../../rest/middleware/private-route.js';

export type ParamsOffer =
  | {
      offerId: string;
    }
  | ParamsDictionary;

export type ParamsCity =
  | {
      city: string;
    }
  | ParamsDictionary;

@injectable()
export default class OfferController extends BaseController {
  constructor(
    @inject(AppComponents.LoggerInterface) logger: LoggerInterface,
    @inject(AppComponents.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
    @inject(AppComponents.UserServiceInterface) private readonly userService: UserServiceInterface,
    @inject(AppComponents.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
  ) {
    super(logger);

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.index,
    });

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new PrivateRouteMiddleware(), new ValidateDtoMiddleware(CreateCommentRequest)],
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferRequest),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [new PrivateRouteMiddleware(), new ValidateObjectIdMiddleware('offerId')],
    });

    this.addRoute({
      path: '/premium/:city',
      method: HttpMethod.Get,
      handler: this.showPremium,
    });

    this.addRoute({
      path: '/favorites/:offerId',
      method: HttpMethod.Post,
      handler: this.addFavorite,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/favorites/:offerId',
      method: HttpMethod.Delete,
      handler: this.deleteFavorite,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/favorites',
      method: HttpMethod.Get,
      handler: this.showFavorites,
      middlewares: [new PrivateRouteMiddleware()],
    });
  }

  public async index({ params }: Request<Record<string, unknown>>, res: Response): Promise<void> {
    const offerCount = params.count ? parseInt(`${params.count}`, 10) : undefined;
    const offers = await this.offerService.find(offerCount);
    this.ok(res, plainToInstance(OfferResponse, offers, { excludeExtraneousValues: true }));
  }

  public async create(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferRequest>,
    res: Response,
  ): Promise<void> {
    const result = await this.offerService.create(body);
    this.created(res, result);
  }

  public async show({ params }: Request<ParamsOffer>, res: Response): Promise<void> {
    const offer = await this.offerService.findById(params.offerId);
    this.ok(res, plainToInstance(OfferResponse, offer, { excludeExtraneousValues: true }));
  }

  public async update(
    { params, body }: Request<ParamsOffer, unknown, UpdateOfferRequest>,
    res: Response,
  ): Promise<void> {
    const updatedOffer = await this.offerService.updateById(params.offerId, body);
    this.ok(res, updatedOffer);
  }

  public async delete({ params }: Request<ParamsOffer>, res: Response): Promise<void> {
    await this.offerService.deleteById(params.offerId);
    await this.commentService.deleteByOfferId(params.offerId);
    this.noContent(res, `Предложение ${params.offerId} было удалено.`);
  }

  public async showPremium({ params }: Request<ParamsCity>, res: Response): Promise<void> {
    const offers = await this.offerService.findPremiumByCity(params.city);
    this.ok(res, plainToInstance(OfferResponse, offers, { excludeExtraneousValues: true }));
  }

  public async showFavorites({ user }: Request, _res: Response): Promise<void> {
    const offers = await this.userService.findFavorites(user.id);
    this.ok(_res, plainToInstance(FavoriteOfferShortResponse, offers, { excludeExtraneousValues: true }));
  }

  public async addFavorite({ params, user }: Request<ParamsOffer>, res: Response): Promise<void> {
    await this.userService.addToFavoritesById(params.offerId, user.id);
    this.noContent(res, { message: 'Offer was added to favorite' });
  }

  public async deleteFavorite({ params, user }: Request<ParamsOffer>, res: Response): Promise<void> {
    await this.userService.removeFromFavoritesById(params.offerId, user.id);
    this.noContent(res, { message: 'Offer was removed from favorite' });
  }
}
