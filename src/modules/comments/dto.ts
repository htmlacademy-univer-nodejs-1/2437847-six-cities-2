import { IsInt, IsMongoId, IsNotEmpty, IsString, Length, Max, Min } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { UserResponse } from '../user/dto.js';

export class CreateCommentRequest {
  @IsString({ message: 'text is required' })
  @Length(5, 1024, { message: 'Min length is 5, max is 1024' })
  public text!: string;

  @IsMongoId({ message: 'offerId field must be a valid id' })
  public offerId!: string;

  public userId!: string;

  @IsInt({ message: 'rating should be an integer.' })
  @IsNotEmpty({ message: 'rating is required.' })
  @Min(1, { message: 'Min value for rating is 1.' })
  @Max(10, { message: 'Max value for rating is 10.' })
  public rating!: number;
}

export default class CommentResponse {
  @Expose()
  public id!: string;

  @Expose()
  public text!: string;

  @Expose()
  public rating!: number;

  @Expose({ name: 'createdAt' })
  public postDate!: string;

  @Expose({ name: 'userId' })
  @Type(() => UserResponse)
  public user!: UserResponse;
}
