import { DocumentType } from '@typegoose/typegoose';
import { CreateUserDto } from './dto.js';
import { UserEntity } from './entity.js';
import { OfferEntity } from '../offer/entity.ts';

export interface UserServiceInterface {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(dto: CreateUserDto): Promise<DocumentType<UserEntity>>;
  addToFavoritesById(userId: string, offerId: string): Promise<DocumentType<OfferEntity>[] | null>;
  removeFromFavoritesById(userId: string, offerId: string): Promise<DocumentType<OfferEntity>[] | null>;
  findFavorites(userId: string): Promise<DocumentType<OfferEntity>[]>;
}
