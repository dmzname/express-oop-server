import 'reflect-metadata';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from '../../common/base.controller';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { TYPES } from '../../types';
import type { IAuthorizationController } from './authorization.controller.interface';
import type { ILoggerService } from '../../logger/logger.service.interface';
import type { IUserService } from '../../entities/User/types';
import { HTTPError } from '../../errors/HTTPError.class';
import { ValidateMiddleware } from '../../common/middlewares/validate';

@injectable()
export class AuthorizationController extends BaseController implements IAuthorizationController {
	constructor(
		@inject(TYPES.ILoggerService) private loggerService: ILoggerService,
		@inject(TYPES.IUserService) private userService: IUserService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(RegisterDto)],
			},
			{ path: '/login', method: 'post', func: this.login },
		]);
	}

	login({ body }: Request<{}, {}, LoginDto>, res: Response, next: NextFunction): void {
		this.ok(res, 'Login');
	}

	async register(
		{ body }: Request<{}, {}, RegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.createUser(body);
		if (!result) {
			next(new HTTPError(422, 'Such user already exists'));
		} else {
			this.ok(res, {
				email: result.email,
				name: result.name,
			});
		}
	}
}
