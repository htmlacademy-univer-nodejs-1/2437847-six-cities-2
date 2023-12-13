import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { City, Facilities, HousingType } from '../../types/enums.js';
import { Coordinates } from '../../types/offer.js';
import { Expose, Type } from 'class-transformer';
import { UserResponse } from '../user/dto.js';

export class CreateOfferRequest {
  @MinLength(10, { message: 'Min length for name is 10' })
  @MaxLength(100, { message: 'Max length for name is 100' })
  public name!: string;

  @MinLength(20, { message: 'Min length for description is 20' })
  @MaxLength(1024, { message: 'Max length for description is 1024' })
  public description!: string;

  @IsEnum(City, { message: 'type must be one of the city' })
  public city!: City;

  @IsString({ message: 'preview path is required.' })
  public previewImage!: string;

  @IsArray({ message: 'field images must be an array' })
  @IsString({ each: true, message: 'image path should be string' })
  public images!: string[];

  @IsBoolean({ message: 'field premium must be boolean' })
  public premium!: boolean;

  @IsEnum(HousingType, { message: 'type must be one of the housing types' })
  public housingType!: HousingType;

  @Min(1, { message: 'Min count of rooms is 1' })
  @Max(8, { message: 'Max count of rooms is 8' })
  public roomCount!: number;

  @Min(1, { message: 'Min count of guests is 1' })
  @Max(10, { message: 'Max count of guests is 10' })
  public guestCount!: number;

  @Min(100, { message: 'Min cost is 100' })
  @Max(100000, { message: 'Max cost is 100000' })
  public cost!: number;

  @IsArray({ message: 'field facilities must be an array' })
  @IsEnum(Facilities, { each: true, message: 'type must be one of the facilities' })
  @ArrayNotEmpty({ message: 'There should be at least 1 facility' })
  public facilities!: Facilities[];

  public userId!: string;

  @IsObject({ message: 'There should be object CoordinatesType' })
  public coordinates!: Coordinates;
}

export class UpdateOfferRequest {
  @IsOptional()
  @MinLength(10, { message: 'Min length for name is 10' })
  @MaxLength(100, { message: 'Max length for name is 100' })
  public name?: string;

  @IsOptional()
  @MinLength(20, { message: 'Min length for description is 20' })
  @MaxLength(1024, { message: 'Max length for description is 1024' })
  public description?: string;

  @IsOptional()
  @IsEnum(City, { message: 'type must be one of the city' })
  public city?: City;

  @IsOptional()
  @IsString({ message: 'preview path is required.' })
  public previewImage?: string;

  @IsOptional()
  @IsArray({ message: 'field images must be an array' })
  @IsString({ each: true, message: 'image path should be string' })
  public images?: string[];

  @IsOptional()
  @IsBoolean({ message: 'field premium must be boolean' })
  public premium?: boolean;

  @IsOptional()
  @IsEnum(HousingType, { message: 'type must be one of the housing types' })
  public housingType?: HousingType;

  @IsOptional()
  @Min(1, { message: 'Min count of rooms is 1' })
  @Max(8, { message: 'Max count of rooms is 8' })
  public roomCount?: number;

  @IsOptional()
  @Min(1, { message: 'Min count of guests is 1' })
  @Max(10, { message: 'Max count of guests is 10' })
  public guestCount?: number;

  @IsOptional()
  @Min(100, { message: 'Min cost is 100' })
  @Max(100000, { message: 'Max cost is 100000' })
  public cost?: number;

  @IsOptional()
  @IsArray({ message: 'field facilities must be an array' })
  @IsEnum(Facilities, { each: true, message: 'type must be one of the facilities' })
  @ArrayNotEmpty({ message: 'There should be at least 1 facility' })
  public facilities?: Facilities[];

  @IsOptional()
  @IsObject({ message: 'There should be object CoordinatesType' })
  public coordinates?: Coordinates;
}

export class OfferResponse {
  @Expose()
  public id!: string;

  @Expose()
  name!: string;

  @Expose()
  publicationDate!: Date;

  @Expose()
  description!: string;

  @Expose()
  city!: City;

  @Expose()
  previewImage!: string;

  @Expose()
  images!: string[];

  @Expose()
  premium!: boolean;

  @Expose()
  favorite!: boolean;

  @Expose()
  rating!: number;

  @Expose()
  housingType!: HousingType;

  @Expose()
  cost!: number;

  @Expose()
  commentsCount!: number;

  @Expose()
  roomCount!: number;

  @Expose()
  guestCount!: number;

  @Expose()
  facilities!: Facilities[];

  @Expose({ name: 'userId' })
  @Type(() => UserResponse)
  offerAuthor!: UserResponse;

  @Expose()
  coordinates!: Coordinates;
}

export class FavoriteOfferShortResponse {
  @Expose()
  public id!: string;

  @Expose()
  name!: string;

  @Expose()
  publicationDate!: Date;

  @Expose()
  city!: City;

  @Expose()
  previewImage!: string;

  @Expose()
  premium!: boolean;

  favorite = true;

  @Expose()
  rating!: number;

  @Expose()
  housingType!: HousingType;

  @Expose()
  cost!: number;

  @Expose()
  commentsCount!: number;
}
