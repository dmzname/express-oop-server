import express, { Express } from 'express';
import { Server } from 'node:http';
import { IAuthorizationController } from './features/authorization/authorization.controller.interface';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { ILoggerService } from './logger/logger.service.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from './types';
import 'reflect-metadata';
import { json } from 'body-parser';
import { IConfigService } from './common/config/configService/types/configServiceInterface';
import { IMongoService } from './database/types';

@injectable()
export class App {
	app: Express;
	port: number;
	server: Server;

	constructor(
		@inject(TYPES.ILoggerService) private logger: ILoggerService,
		@inject(TYPES.IAuthorizationController)
		private authorizationController: IAuthorizationController,
		@inject(TYPES.IExceptionFilter) private exceptionFilter: IExceptionFilter,
		@inject(TYPES.IConfigService) private configService: IConfigService,
		@inject(TYPES.IMongoService) private mongooseService: IMongoService,
	) {
		this.app = express();
		this.port = Number(configService.get('PORT')) || 5000;
	}

	useMiddlewares(): void {
		this.app.use(json());
	}

	useRoutes(): void {
		this.app.use('/', this.authorizationController.router);
	}

	useExceptionFilters(): void {
		this.app.use(this.exceptionFilter.catch.bind(this));
	}

	public async init(): Promise<void> {
		this.useMiddlewares();
		this.useRoutes();
		this.useExceptionFilters();
		await this.mongooseService.connect();
		this.server = this.app.listen(this.port);
		this.logger.log(`Server started on: http://localhost:${this.port}`);
	}
}
