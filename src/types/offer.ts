import { City, Facilities, HousingType } from './enums.js';
import { User } from './user.js';

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type Offer = {
  name: string;
  description: string;
  publicationDate: Date;
  city: City;
  previewImage: string;
  images: Array<string>;
  premium: boolean;
  isFavourite: boolean;
  rating: number;
  housingType: HousingType;
  roomCount: number;
  guestCount: number;
  cost: number;
  facilities: Array<Facilities>;
  userId: User;
  commentsCount: number;
  coordinates: Coordinates;
};
