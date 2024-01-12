import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { Response, Router } from 'express';
import { DependencyRegistry } from '../../types/DependencyRegistry';
import { ILoggerService } from '../../services/loggerServices';
import { IRoute } from './types';

@injectable()
export abstract class BaseController {
	private readonly _router: Router;

	constructor(@inject(DependencyRegistry.ILoggerService) private logger: ILoggerService) {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	public send<T>(res: Response, code: number, message: T): Response<any, Record<string, any>> {
		res.type('application/json');
		return res.status(code).json(message);
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
