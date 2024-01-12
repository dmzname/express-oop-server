import { NextFunction, Request, Response, Router } from 'express';

export interface IAuthorizationController {
	router: Router;
	login: (req: Request, res: Response, next: NextFunction) => void;
	register: (req: Request, res: Response, next: NextFunction) => void;
}
