import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import { HttpError } from './http-error.js';
import { ExceptionFilterInterface } from './exeption-filter.interface';
import { LoggerInterface } from '../../core/logger/logger.interface';
import { AppComponents } from '../../types/app-components.js';

@injectable()
export default class ExceptionFilter implements ExceptionFilterInterface {
  constructor(@inject(AppComponents.LoggerInterface) private logger: LoggerInterface) {
    this.logger.info('Register ExceptionFilter');
  }

  private handleHttpError(error: HttpError, _req: Request, res: Response, _next: NextFunction) {
    this.logger.error(`[${error.detail}]: ${error.statusCode} — ${error.message}`);
    res.status(error.statusCode).json({ error: error.message });
  }

  private handleOtherError(error: Error, _req: Request, res: Response, _next: NextFunction) {
    this.logger.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }

  public catch(error: Error | HttpError, req: Request, res: Response, next: NextFunction): void {
    if (error instanceof HttpError) {
      return this.handleHttpError(error, req, res, next);
    }

    this.handleOtherError(error, req, res, next);
  }
}
