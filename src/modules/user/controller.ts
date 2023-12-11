import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';
import { plainToInstance } from 'class-transformer';
import { BaseController } from '../../rest/controller/baseController.js';
import { LoggerInterface } from '../../core/logger/logger.interface';
import { UserServiceInterface } from './interface.js';
import { AppComponents } from '../../types/appComponents.js';
import { RestSchema } from '../../core/config/rest.schema';
import { ConfigInterface } from '../../core/config/config.interface';
import { HttpMethod } from '../../rest/types/httpMethod.js';
import { CreateUserDto, LoginUserDto } from './dto.js';
import { HttpError } from '../../rest/exceptions/httpError.js';
import { OfferDto } from '../offer/dto.js';

@injectable()
export default class UserController extends BaseController {
  constructor(
    @inject(AppComponents.LoggerInterface) logger: LoggerInterface,
    @inject(AppComponents.UserServiceInterface) private readonly userService: UserServiceInterface,
    @inject(AppComponents.ConfigInterface) private readonly configService: ConfigInterface<RestSchema>,
  ) {
    super(logger);

    this.logger.info('Register routes for UserController…');

    this.addRoute({ path: '/register', method: HttpMethod.Post, handler: this.register });
    this.addRoute({ path: '/login', method: HttpMethod.Post, handler: this.login });
    this.addRoute({ path: '/logout', method: HttpMethod.Post, handler: this.logout });
    this.addRoute({ path: '/favorite/:offerId', method: HttpMethod.Post, handler: this.addFavorite });
    this.addRoute({ path: '/favorite/:offerId', method: HttpMethod.Delete, handler: this.deleteFavorite });
    this.addRoute({ path: '/favorite', method: HttpMethod.Get, handler: this.getFavorite });
  }

  public async register(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>,
    res: Response,
  ): Promise<void> {
    const user = await this.userService.findByEmail(body.email);

    if (user) {
      throw new HttpError(StatusCodes.CONFLICT, `User with email ${body.email} already exists.`, 'UserController');
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.created(res, plainToInstance(CreateUserDto, result, { excludeExtraneousValues: true }));
  }

  public async login(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, LoginUserDto>,
    _res: Response,
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (!existsUser) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, `User with email ${body.email} not found.`, 'UserController');
    }

    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'Not implemented', 'UserController');
  }

  public async logout(_req: Request, _res: Response): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'Not implemented', 'UserController');
  }

  public async getFavorite(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, { userId: string }>,
    _res: Response,
  ): Promise<void> {
    const result = await this.userService.findFavorites(body.userId);
    this.ok(_res, plainToInstance(OfferDto, result, { excludeExtraneousValues: true }));
  }

  public async addFavorite(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, { offerId: string; userId: string }>,
    res: Response,
  ): Promise<void> {
    await this.userService.addToFavoritesById(body.offerId, body.userId);
    this.noContent(res, { message: 'Предложение добавлено в избранное' });
  }

  public async deleteFavorite(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, { offerId: string; userId: string }>,
    res: Response,
  ): Promise<void> {
    await this.userService.removeFromFavoritesById(body.offerId, body.userId);
    this.noContent(res, { message: 'Предложение удалено из избранного' });
  }
}
