import 'reflect-metadata';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { DependencyRegistry } from '../../types/DependencyRegistry';
import type { IAuthorizationController } from './types';
import type { ILoggerService } from '../../services/loggerServices';
import { BaseController } from '../baseController';
import { ValidateMiddleware } from '../../middlewares/validateMiddleware/validate';
import { IUserService } from '../../services/userService/types';
import { IExceptionFilter } from '../../utils/error-handlers/types';

@injectable()
export class AuthorizationController extends BaseController implements IAuthorizationController {
	constructor(
		@inject(DependencyRegistry.ILoggerService) private loggerService: ILoggerService,
		@inject(DependencyRegistry.IUserService) private userService: IUserService,
		@inject(DependencyRegistry.IExceptionFilter) private exceptionFilter: IExceptionFilter,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(RegisterDto)],
			},
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddleware(LoginDto)],
			},
		]);
	}

	async login(req: Request<{}, {}, LoginDto>, res: Response, next: NextFunction): Promise<void> {
		try {
			const { body } = req;
			this.send(res, 200, 'LOGIN');
		} catch (err) {}
	}

	async register(req: Request<{}, {}, RegisterDto>, res: Response, next: NextFunction): Promise<void> {
		try {
			const { body } = req;
			const result = await this.userService.createUser(body);
			if (result) {
				this.send(res, 200, {
					email: result.email,
					username: result.username,
				});
			}
		} catch (error) {
			if (error instanceof Error) this.exceptionFilter.catch(error, req, res, next);
		}
	}
}
