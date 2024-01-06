import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
import { MiddlewareInterface } from './middleware.interface.js';
import { DocumentExistsInterface } from '../../modules/common/document-exists.inerface';
import { HttpError } from '../exceptions/http-error.js';

export class DocumentExistsMiddleware implements MiddlewareInterface {
  constructor(
    private readonly service: DocumentExistsInterface,
    private readonly entityName: string,
    private readonly paramName: string,
  ) {}

  public async execute({ params }: Request, _res: Response, next: NextFunction): Promise<void> {
    const documentId = params[this.paramName];
    if (!(await this.service.exists(documentId))) {
      throw new HttpError(StatusCodes.NOT_FOUND, `${this.entityName} with ${documentId} not found.`, 'DocumentExists');
    }

    next();
  }
}
