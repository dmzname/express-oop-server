import { UserDataDto } from './dto/UserData.dto';
import { User } from './user';
import { inject, injectable } from 'inversify';
import { IUserService } from './types';
import { TYPES } from '../../types';
import { IConfigService } from '../../common/config/configService/types/configServiceInterface';

@injectable()
export class UserService implements IUserService {
	constructor(@inject(TYPES.IConfigService) private configService: IConfigService) {}

	async createUser({ email, name, password }: UserDataDto): Promise<User | null> {
		const newUser = new User(email, name);
		const salt = this.configService.get('SALT');
		await newUser.setPassword(password, Number(salt));
		if (!newUser) {
			return null;
		} else {
			return newUser;
		}
	}
}
