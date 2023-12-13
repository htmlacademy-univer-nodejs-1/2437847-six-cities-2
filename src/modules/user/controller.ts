import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';
import { plainToInstance } from 'class-transformer';
import { BaseController } from '../../rest/controller/baseController.js';
import { LoggerInterface } from '../../core/logger/logger.interface';
import { UserServiceInterface } from './interface.js';
import { AppComponents } from '../../types/appComponents.js';
import { HttpMethod } from '../../rest/types/httpMethod.js';
import { HttpError } from '../../rest/exceptions/httpError.js';
import { LoginUserResponse, CreateUserRequest, LoginUserRequest } from './dto.js';
import { UploadFileMiddleware } from '../../rest/middleware/uploadFile.js';
import { ValidateObjectIdMiddleware } from '../../rest/middleware/validateObjectId.js';
import { ConfigInterface } from '../../core/config/config.interface';
import { RestSchema } from '../../core/config/rest.schema.js';
import { createJWT } from '../../core/helpers/jwt.js';
import { BLACK_LIST_TOKENS } from '../../rest/middleware/authenticate.js';
import { PrivateRouteMiddleware } from '../../rest/middleware/privateRoute.js';

type LoginUserRequestType = Request<Record<string, unknown>, Record<string, unknown>, LoginUserRequest>;

@injectable()
export default class UserController extends BaseController {
  constructor(
    @inject(AppComponents.LoggerInterface) logger: LoggerInterface,
    @inject(AppComponents.ConfigInterface) private readonly config: ConfigInterface<RestSchema>,
    @inject(AppComponents.UserServiceInterface) private readonly userService: UserServiceInterface,
  ) {
    super(logger);

    this.logger.info('Register routes for UserController…');

    this.addRoute({ path: '/register', method: HttpMethod.Post, handler: this.register });
    this.addRoute({ path: '/login', method: HttpMethod.Post, handler: this.login });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Get,
      handler: this.checkAuthenticate,
    });
    this.addRoute({
      path: '/logout',
      method: HttpMethod.Post,
      handler: this.logout,
      middlewares: [new PrivateRouteMiddleware()],
    });
    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new UploadFileMiddleware(this.config.get('UPLOAD_DIRECTORY'), 'avatar'),
      ],
    });
  }

  public async register(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, CreateUserRequest>,
    res: Response,
  ): Promise<void> {
    const user = await this.userService.findByEmail(body.email);

    if (user) {
      throw new HttpError(StatusCodes.CONFLICT, `User with email ${body.email} already exists.`, 'UserController');
    }

    const result = await this.userService.create(body);
    this.created(res, plainToInstance(CreateUserRequest, result, { excludeExtraneousValues: true }));
  }

  public async login({ body }: LoginUserRequestType, res: Response): Promise<void> {
    const user = await this.userService.verifyUser(body);

    if (!user) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Unauthorized', 'UserController');
    }

    const token = await createJWT(this.config.get('JWT_SECRET'), {
      email: user.email,
      id: user.id,
    });
    this.ok(
      res,
      plainToInstance(
        LoginUserResponse,
        {
          email: user.email,
          token,
        },
        { excludeExtraneousValues: true },
      ),
    );
  }

  public async checkAuthenticate({ user: { email } }: Request, res: Response) {
    const foundedUser = await this.userService.findByEmail(email);

    if (!foundedUser) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Unauthorized', 'UserController');
    }

    this.ok(res, plainToInstance(LoginUserResponse, foundedUser, { excludeExtraneousValues: true }));
  }

  public async logout(req: Request, res: Response): Promise<void> {
    const [, token] = String(req.headers.authorization?.split(' '));

    if (!req.user) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Unauthorized', 'UserController');
    }

    BLACK_LIST_TOKENS.add(token);

    this.noContent(res, { token });
  }

  public async uploadAvatar(req: Request, res: Response) {
    this.created(res, {
      filepath: req.file?.path,
    });
  }
}
