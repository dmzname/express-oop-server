import 'reflect-metadata';
import express, { Express } from 'express';
import dotenv from 'dotenv';
import { json } from 'body-parser';
import { Server } from 'node:http';
import { inject, injectable } from 'inversify';
import { ILoggerService } from './services/loggerServices';
import { DependencyRegistry } from './types/DependencyRegistry';
import { IAuthorizationController } from './controllers/authorizationController';
import { IMongoService } from './database/mongoDb/types';

dotenv.config();

@injectable()
export class App {
	app: Express;
	port: number;
	server: Server;

	constructor(
		@inject(DependencyRegistry.ILoggerService) private logger: ILoggerService,
		@inject(DependencyRegistry.IAuthorizationController) private authorization: IAuthorizationController,
		@inject(DependencyRegistry.IMongoService) private mongoService: IMongoService,
	) {
		this.app = express();
		this.port = Number(process.env.PORT) || 5000;
	}

	useMiddlewares(): void {
		this.app.use(json());
	}

	useRoutes(): void {
		this.app.use('/', this.authorization.router);
	}

	public async init(): Promise<void> {
		this.useMiddlewares();
		this.useRoutes();
		await this.mongoService.connect();
		this.server = this.app.listen(this.port);
		this.logger.log(`Server started on: http://localhost:${this.port}`);
	}
}

// TODO: Сделать авторизацию (логин)
// TODO: Решить вопрос с types.ts переструктурировать в папку types с названием файла
