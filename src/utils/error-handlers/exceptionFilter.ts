import 'reflect-metadata';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { DependencyRegistry } from '../../types/DependencyRegistry';
import { IExceptionFilter } from './types';
import { ILoggerService } from '../../services/loggerServices';
import { HTTPError } from './HTTPError.class';

@injectable()
export class ExceptionFilter implements IExceptionFilter {
	constructor(@inject(DependencyRegistry.ILoggerService) private logger: ILoggerService) {}

	catch(err: Error | HTTPError, req: Request, res: Response, next: NextFunction): void {
		if (err instanceof HTTPError) {
			this.logger.error(`${!err.context ? '' : `[${err.context}] `}Error ${err.statusCode} : ${err.message}`);
			res.status(err.statusCode).send({ error: err.message });
		} else {
			this.logger.error(`${err.message}`);
			res.status(500).send({ error: err.message });
		}
	}
}
