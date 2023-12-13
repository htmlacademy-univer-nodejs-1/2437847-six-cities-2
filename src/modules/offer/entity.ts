import typegoose, { defaultClasses, getModelForClass, Ref, Severity } from '@typegoose/typegoose';
import { City, Facilities, HousingType } from '../../types/enums.js';
import { UserEntity } from '../user/entity.js';
import { Coordinates } from '../../types/offer.js';
import mongoose from 'mongoose';

const { prop, modelOptions } = typegoose;

export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
  },
})
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({
    required: true,
    type: () => String,
    enum: City,
  })
  public city!: City;

  @prop({ default: 0, type: () => Number, min: [0, 'Min comments count is 0'] })
  public commentsCount!: number;

  @prop({
    required: true,
    type: () => Number,
    min: [100, 'Min cost is 100'],
    max: [100000, 'Max cost is 100000'],
  })
  public cost!: number;

  @prop({
    required: true,
    trim: true,
    type: () => String,
    minlength: [20, 'Min length for description is 20'],
    maxlength: [1024, 'Max length for description is 1024'],
  })
  public description!: string;

  @prop({
    required: true,
    type: () => String,
    enum: Facilities,
  })
  public facilities!: Facilities[];

  @prop({
    required: true,
    type: () => Number,
    min: [1, 'Min count of guests is 1'],
    max: [10, 'Max count of guests is 10'],
  })
  public guestCount!: number;

  @prop({
    required: true,
    type: () => String,
    enum: HousingType,
  })
  public housingType!: HousingType;

  @prop({
    type: () => [String],
    minCount: [6, 'Images should be 6'],
    maxCount: [6, 'Images should be 6'],
  })
  public images!: string[];

  @prop({
    required: true,
    trim: true,
    type: () => String,
    minlength: [10, 'Min length for name is 10'],
    maxlength: [100, 'Max length for name is 15'],
  })
  public name!: string;

  @prop({
    ref: UserEntity,
    required: true,
  })
  public userId!: Ref<UserEntity>;

  @prop({ required: true, default: false, type: () => Boolean })
  public premium!: boolean;

  @prop({ required: true, type: () => String })
  public previewImage!: string;

  @prop({ required: true, type: () => Date })
  public publicationDate!: Date;

  @prop({
    required: true,
    type: () => Number,
    min: [1, 'Min rating is 1'],
    max: [5, 'Max rating is 5'],
  })
  public rating!: number;

  @prop({
    required: true,
    type: () => Number,
    min: [1, 'Min room count is 1'],
    max: [8, 'Max room count is 8'],
  })
  public roomCount!: number;

  @prop({
    required: true,
    type: () => mongoose.Schema.Types.Mixed,
    allowMixed: Severity.ALLOW,
  })
  public coordinates!: Coordinates;
}

export const OfferModel = getModelForClass(OfferEntity);
