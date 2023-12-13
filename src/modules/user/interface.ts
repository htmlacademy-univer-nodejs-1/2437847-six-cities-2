import { DocumentType } from '@typegoose/typegoose';
import { UserEntity } from './entity.js';
import { OfferEntity } from '../offer/entity.js';
import { CreateUserRequest } from './dto.js';

export interface UserServiceInterface {
  create(dto: CreateUserRequest): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(dto: CreateUserRequest): Promise<DocumentType<UserEntity>>;
  findById(userId: string): Promise<DocumentType<UserEntity> | null>;
  findFavorites(userId: string): Promise<DocumentType<OfferEntity>[]>;
  addToFavoritesById(userId: string, offerId: string): Promise<DocumentType<OfferEntity>[] | null>;
  removeFromFavoritesById(userId: string, offerId: string): Promise<DocumentType<OfferEntity>[] | null>;
}
