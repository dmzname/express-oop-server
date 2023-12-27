import { UserDataDto } from './dto/UserData.dto';
import { User } from './user';

export interface IUserService {
	createUser: (dto: UserDataDto) => Promise<User | null>;
}
