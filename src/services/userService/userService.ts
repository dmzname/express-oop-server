import { inject, injectable } from 'inversify';
import { Document, WithId } from 'mongodb';
import { IUserService } from './types/userServiceTypes';
import { DependencyRegistry } from '../../types/DependencyRegistry';
import { User } from '../../models/User/user';
import { UserDataDto } from '../../models/User/dto/UserData.dto';
import { IUserRepository } from '../../repositories/userRepository/types';
import { HTTPError } from '../../utils/error-handlers/HTTPError.class';
import { LoginDto } from '../../controllers/authorizationController/dto/login.dto';
import { IUser } from '../../models/User/types';

@injectable()
export class UserService implements IUserService {
	constructor(@inject(DependencyRegistry.IUserRepository) private userRepository: IUserRepository) {}

	async createUser({ email, username, password }: UserDataDto): Promise<WithId<Document> | null> {
		try {
			const existedUser = await this.userRepository.find(email);
			if (existedUser) {
				throw new HTTPError(422, 'Such user already exists');
			}

			const salt = process.env.SALT || '10';
			const newUser = new User(email, username);
			await newUser.setPassword(password, Number(salt));
			return this.userRepository.create(newUser);
		} catch (err) {
			if (err instanceof Error) throw new Error(err.message);
			return null;
		}
	}

	async loginValidateUser({ email, password }: LoginDto): Promise<IUser | null> {
		try {
			const existedUser = await this.userRepository.find(email);
			if (!existedUser) {
				throw new HTTPError(422, 'User not found');
			}
			const newUser = new User(existedUser.email, existedUser.username, existedUser.password);
			const isValidPassword = await newUser.comparePassword(password);

			if (!isValidPassword) {
				throw new HTTPError(422, 'Email or password is not valid');
			}
			return newUser;
		} catch (err) {
			if (err instanceof Error) throw new Error(err.message);
			return null;
		}
	}
}
