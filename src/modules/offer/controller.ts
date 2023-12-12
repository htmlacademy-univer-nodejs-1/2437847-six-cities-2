import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { AppComponents } from '../../types/appComponents.js';
import { BaseController } from '../../rest/controller/baseController.js';
import { LoggerInterface } from '../../core/logger/logger.interface';
import { OfferServiceInterface } from './interface.js';
import { UserServiceInterface } from '../user/interface.js';
import { CommentServiceInterface } from '../comments/interface.js';
import { HttpMethod } from '../../rest/types/httpMethod.js';
import { ValidateDtoMiddleware } from '../../rest/middleware/validateRequest.js';
import { CreateCommentRequest } from '../comments/dto.js';
import { ValidateObjectIdMiddleware } from '../../rest/middleware/validateObjectId.js';
import { DocumentExistsMiddleware } from '../../rest/middleware/documentExists.js';
import { CreateOfferRequest, FavoriteOfferShortResponse, OfferResponse, UpdateOfferRequest } from './dto.js';
import { plainToInstance } from 'class-transformer';
import { ParamsDictionary } from 'express-serve-static-core';

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
      middlewares: [new ValidateDtoMiddleware(CreateCommentRequest)],
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
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferRequest),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [new ValidateObjectIdMiddleware('offerId')],
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
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/favorites/:offerId',
      method: HttpMethod.Delete,
      handler: this.deleteFavorite,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/favorites',
      method: HttpMethod.Get,
      handler: this.showFavorites,
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

  public async showFavorites(
    {
      body,
    }: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      {
        userId: string;
      }
    >,
    _res: Response,
  ): Promise<void> {
    const offers = await this.userService.findFavorites(body.userId);
    this.ok(_res, plainToInstance(FavoriteOfferShortResponse, offers, { excludeExtraneousValues: true }));
  }

  public async addFavorite(
    {
      body,
    }: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      {
        offerId: string;
        userId: string;
      }
    >,
    res: Response,
  ): Promise<void> {
    await this.userService.addToFavoritesById(body.offerId, body.userId);
    this.noContent(res, { message: 'Offer was added to favorite' });
  }

  public async deleteFavorite(
    {
      body,
    }: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      {
        offerId: string;
        userId: string;
      }
    >,
    res: Response,
  ): Promise<void> {
    await this.userService.removeFromFavoritesById(body.offerId, body.userId);
    this.noContent(res, { message: 'Offer was removed from favorite' });
  }
}
