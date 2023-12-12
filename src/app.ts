import express, {Express} from "express";
import {Server} from "node:http";
import {IAuthorizationController} from "./authorization/authorization.controller.interface";
import {IExceptionFilter} from "./errors/exception.filter.interface";
import {ILoggerService} from "./logger/logger.service.interface";
import {inject, injectable} from "inversify";
import {TYPES} from "./types";
import 'reflect-metadata';

@injectable()
export class App {
    app: Express;
    port: number;
    server: Server;

    constructor(
        @inject(TYPES.ILoggerService) private logger: ILoggerService,
        @inject(TYPES.IAuthorizationController) private authorizationController: IAuthorizationController,
        @inject(TYPES.IExceptionFilter) private exceptionFilter: IExceptionFilter,
    ) {
        this.app = express();
        this.port = 5000;
    }

    useRoutes() {
        this.app.use('/', this.authorizationController.router);
    }

    useExceptionFilters() {
        this.app.use(this.exceptionFilter.catch.bind(this));
    }

    public async init() {
        this.useRoutes();
        this.useExceptionFilters();
        this.server = this.app.listen(this.port);
        this.logger.log(`Server started on: http://localhost:${this.port}`);
    }
}