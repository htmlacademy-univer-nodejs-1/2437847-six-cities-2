import { User } from '../../types/user.js';
import typegoose, { defaultClasses, getModelForClass } from '@typegoose/typegoose';
import { UserType } from '../../types/enums.js';
import { createSHA256 } from '../../core/helpers/common.js';
import { ConfigInterface } from '../../core/config/config.interface.js';
import { RestSchema } from '../../core/config/rest.schema.js';

const { prop, modelOptions } = typegoose;

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
  },
})
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({ unique: true, required: true })
  public email: string;

  @prop({ required: false, default: '' })
  public avatar?: string;

  @prop({ required: true, default: '' })
  public name: string;

  @prop({ required: true, default: '' })
  private password?: string;

  @prop({ required: true, default: UserType.STANDART })
  public type: UserType;

  constructor(
    userData: User,
    private readonly config?: ConfigInterface<RestSchema>,
  ) {
    super();

    this.email = userData.email;
    this.avatar = userData.avatar;
    this.name = userData.name;
    this.type = userData.type;
  }

  public setPassword(password: string) {
    this.password = createSHA256(password, this.config?.get('SALT') || '');
  }

  public getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
