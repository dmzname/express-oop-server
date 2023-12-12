import {inject, injectable} from "inversify";
import 'reflect-metadata';
import {Router, Response} from "express";
import {IRoute} from "./route.interface";
import {ILoggerService} from "../logger/logger.service.interface";
import {TYPES} from "../types";

@injectable()
export abstract class BaseController {
    private readonly _router: Router;

    constructor(
        @inject(TYPES.ILoggerService) private logger: ILoggerService
    ) {
        this._router = Router();
    }

    get router() {
        return this._router;
    }

    public send<T>(res: Response, code: number, message: T) {
        res.type('application/json');
        return res.status(code).json(message);
    }

    public ok<T>(res: Response, message: T) {
        this.send(res, 200, message);
    }

    public created(res: Response) {
        return res.sendStatus(201);
    }

    protected bindRoutes(routes: IRoute[]) {
        routes.forEach((route) => {
            this.logger.log(`[${route.method}] ${route.path}`);
            const handler = route.func.bind(this);
            this.router[route.method](route.path, handler);
        })
    }
}