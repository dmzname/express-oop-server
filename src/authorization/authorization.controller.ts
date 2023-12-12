import {BaseController} from "../common/base.controller";
import {Request, Response, NextFunction} from 'express';
import {IAuthorizationController} from "./authorization.controller.interface";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {ILoggerService} from "../logger/logger.service.interface";
import 'reflect-metadata';

@injectable()
export class AuthorizationController extends BaseController implements IAuthorizationController {
    constructor(
        @inject(TYPES.ILoggerService) private loggerService: ILoggerService
    ) {
        super(loggerService);
        this.bindRoutes([
            {path: '/register', method: 'post', func: this.register},
            {path: '/login', method: 'post', func: this.login}
        ])
    }

    login(req: Request, res: Response, next: NextFunction) {
        // next(new HTTPError(401, 'error'));
        this.ok(res, 'Login');
    }

    register(req: Request, res: Response, next: NextFunction) {
        this.ok(res, 'Register');
    }
}