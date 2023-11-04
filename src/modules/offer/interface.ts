import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from './entity.js';
import { CreateOfferDto } from './dto.js';

export interface OfferServiceInterface {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;

  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
}
