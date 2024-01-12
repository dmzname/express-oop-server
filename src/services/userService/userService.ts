import { inject, injectable } from 'inversify';
import { Document, WithId } from 'mongodb';
import { IUserService } from './types';
import { DependencyRegistry } from '../../types/DependencyRegistry';
import { User } from '../../models/User/user';
import { UserDataDto } from '../../models/User/dto/UserData.dto';
import { IUserRepository } from '../../repositories/userRepository/types';
import { HTTPError } from '../../utils/error-handlers/HTTPError.class';

@injectable()
export class UserService implements IUserService {
	constructor(@inject(DependencyRegistry.IUserRepository) private userRepository: IUserRepository) {}

	async createUser({ email, username, password }: UserDataDto): Promise<WithId<Document> | null> {
		try {
			const existedUser = await this.userRepository.find(email);
			if (existedUser.length > 0) {
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
}
