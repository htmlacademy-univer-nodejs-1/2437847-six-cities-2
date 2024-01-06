import { NextFunction, Request, Response } from 'express';
import { HttpMethod } from './http-method.js';
import { MiddlewareInterface } from '../middleware/middleware.interface';

export interface RouteInterface {
  path: string;
  method: HttpMethod;
  middlewares?: MiddlewareInterface[];
  handler: (req: Request, res: Response, next: NextFunction) => void;
}
