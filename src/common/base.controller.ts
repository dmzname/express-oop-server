import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { Response, Router } from 'express';
import { IRoute } from './types/route.interface';
import { ILoggerService } from '../logger/logger.service.interface';
import { TYPES } from '../types';

@injectable()
export abstract class BaseController {
	private readonly _router: Router;

	constructor(@inject(TYPES.ILoggerService) private logger: ILoggerService) {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	public send<T>(res: Response, code: number, message: T): Response<any, Record<string, any>> {
		res.type('application/json');
		return res.status(code).json(message);
	}

	public ok<T>(res: Response, message: T): void {
		this.send(res, 200, message);
	}

	public created(res: Response): Response<any, Record<string, any>> {
		return res.sendStatus(201);
	}

	protected bindRoutes(routes: IRoute[]): void {
		routes.forEach((route) => {
			this.logger.log(`[${route.method}] ${route.path}`);
			const middleware = route.middlewares?.map((m) => m.execute.bind(m));
			const handler = route.func.bind(this);
			const pipeline = middleware ? [...middleware, handler] : handler;
			this.router[route.method](route.path, pipeline);
		});
	}
}
