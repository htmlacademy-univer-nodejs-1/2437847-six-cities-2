import { UserEntity } from './entity.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { CreateUserDto } from './dto.js';
import { UserServiceInterface } from './interface.js';
import { inject, injectable } from 'inversify';
import { AppComponents } from '../../types/appComponents.js';
import { LoggerInterface } from '../../core/logger/logger.interface.js';
import { UserType } from '../../types/enums.js';
import { ConfigInterface } from '../../core/config/config.interface.js';
import { RestSchema } from '../../core/config/rest.schema.js';
import { OfferEntity } from '../offer/entity.js';

@injectable()
export default class UserService implements UserServiceInterface {
  constructor(
    @inject(AppComponents.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponents.ConfigInterface) private readonly config: ConfigInterface<RestSchema>,
    @inject(AppComponents.UserModel) private readonly userModel: types.ModelType<UserEntity>,
  ) {}

  public async create(dto: CreateUserDto): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity({ ...dto, type: UserType.STANDART }, this.config);
    user.setPassword(dto.password);

    const result = await this.userModel.create(user);
    this.logger.info(`New user created: ${user.email}`);

    return result;
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({ email });
  }

  public async findOrCreate(dto: CreateUserDto): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    return this.create(dto);
  }

  public addToFavoritesById(userId: string, offerId: string): Promise<DocumentType<OfferEntity>[] | null> {
    return this.userModel.findByIdAndUpdate(userId, { $push: { favorite: offerId }, new: true });
  }

  public removeFromFavoritesById(userId: string, offerId: string): Promise<DocumentType<OfferEntity>[] | null> {
    return this.userModel.findByIdAndUpdate(userId, { $pull: { favorite: offerId }, new: true });
  }

  public async findFavorites(userId: string): Promise<DocumentType<OfferEntity>[]> {
    const offers = await this.userModel.findById(userId).select('favorite');
    if (!offers) {
      return [];
    }

    return this.userModel.find({ _id: { $in: offers } }).populate('offerId');
  }
}
