import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from './entity.js';
import { DocumentExistsInterface } from '../common/document-exists.inerface';
import { CreateOfferRequest, UpdateOfferRequest } from './dto.js';

export interface OfferServiceInterface extends DocumentExistsInterface {
  create(dto: CreateOfferRequest): Promise<DocumentType<OfferEntity>>;
  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  find(count: number | undefined): Promise<DocumentType<OfferEntity>[]>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  updateById(offerId: string, dto: UpdateOfferRequest): Promise<DocumentType<OfferEntity> | null>;
  findPremiumByCity(city: string): Promise<DocumentType<OfferEntity>[]>;
  incComment(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  exists(documentId: string): Promise<boolean>;
  updateRating(offerId: string, rating: number): Promise<void>;
}
