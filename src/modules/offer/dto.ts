import { City, Facilities, HousingType } from '../../types/enums.js';
import { User } from '../../types/user.js';
import { Coordinates } from '../../types/offer.js';

export class CreateOfferDto {
  public title!: string;
  public description!: string;
  public publicationDate!: Date;
  public city!: City;
  public preview!: string;
  public images!: Array<string>;
  public isPremium!: boolean;
  public isFavourite!: boolean;
  public rating!: number;
  public housingType!: HousingType;
  public roomCount!: number;
  public guestCount!: number;
  public cost!: number;
  public facilities!: Array<Facilities>;
  public author!: User;
  public commentsCount!: number;
  public coordinates!: Coordinates;
}
