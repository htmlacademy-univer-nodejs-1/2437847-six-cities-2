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
  @prop({ unique: true, required: true, type: () => String })
  public email: string;

  @prop({
    required: false,
    type: () => String,
    default: '',
    match: [/.*\.(?:jpg|png)/, 'Avatar must be jpg or png'],
  })
  public avatar?: string;

  @prop({
    required: true,
    type: () => String,
    minlength: [1, 'Min length for username is 1'],
    maxlength: [15, 'Max length for username is 15'],
  })
  public username: string;

  @prop({
    required: true,
    type: () => String,
    enum: UserType,
  })
  public type: UserType;

  @prop({
    required: true,
    type: () => [String],
  })
  public favorite!: string[];

  @prop({
    required: true,
    type: () => String,
    default: '',
  })
  private password?: string;

  constructor(
    userData: User,
    private readonly config?: ConfigInterface<RestSchema>,
  ) {
    super();

    this.email = userData.email;
    this.avatar = userData.avatar;
    this.username = userData.username;
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
