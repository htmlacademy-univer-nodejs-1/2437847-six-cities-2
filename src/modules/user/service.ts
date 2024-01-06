import { inject, injectable } from 'inversify';
import { UserServiceInterface } from './interface.js';
import { LoggerInterface } from '../../core/logger/logger.interface';
import { AppComponents } from '../../types/app-components.js';
import { UserEntity } from './entity.js';
import { CreateUserRequest, LoginUserRequest } from './dto.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { UserType } from '../../types/enums.js';
import { ConfigInterface } from '../../core/config/config.interface';
import { RestSchema } from '../../core/config/rest.schema';
import { OfferEntity } from '../offer/entity.js';

@injectable()
export default class UserService implements UserServiceInterface {
  constructor(
    @inject(AppComponents.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponents.ConfigInterface) private readonly config: ConfigInterface<RestSchema>,
    @inject(AppComponents.UserModel) private readonly userModel: types.ModelType<UserEntity>,
  ) {}

  public async create(dto: CreateUserRequest): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity({ ...dto, type: UserType.STANDART }, this.config);
    user.setPassword(dto.password);

    const result = await this.userModel.create(user);
    this.logger.info(`New user was created: ${user.email}`);

    return result;
  }

  public async findFavorites(userId: string): Promise<DocumentType<OfferEntity>[]> {
    const offers = await this.userModel.findById(userId).select('favorite');
    if (!offers) {
      return [];
    }

    return this.userModel.find({ _id: { $in: offers.favorite } }).populate('offerId');
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({ email });
  }

  public async findOrCreate(dto: CreateUserRequest): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    return this.create(dto);
  }

  public async findById(userId: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({ _id: userId });
  }

  public addToFavoritesById(userId: string, offerId: string): Promise<DocumentType<OfferEntity>[] | null> {
    return this.userModel.findByIdAndUpdate(userId, { $push: { favorite: offerId }, new: true });
  }

  public removeFromFavoritesById(userId: string, offerId: string): Promise<DocumentType<OfferEntity>[] | null> {
    return this.userModel.findByIdAndUpdate(userId, { $pull: { favorite: offerId }, new: true });
  }

  public async verifyUser(dto: LoginUserRequest): Promise<DocumentType<UserEntity> | null> {
    const user = await this.findByEmail(dto.email);

    if (!user) {
      return null;
    }

    if (user.verifyPassword(dto.password)) {
      return user;
    }

    return null;
  }
}
