import { IUserRepository } from './types';
import { inject, injectable } from 'inversify';
import { Db, Document, WithId } from 'mongodb';
import { DependencyRegistry } from '../../types/DependencyRegistry';
import { DataBaseCollections, IMongoService } from '../../database/mongoDb/types';
import { User } from '../../models/User/user';
import { userSchema } from '../../models/User/userSchema';
import { ILoggerService } from '../../services/loggerServices';
import { IExceptionFilter } from '../../utils/error-handlers/types';
import { HTTPError } from '../../utils/error-handlers/HTTPError.class';

@injectable()
export class UserRepository implements IUserRepository {
	db: Db;

	constructor(
		@inject(DependencyRegistry.ILoggerService) private logger: ILoggerService,
		@inject(DependencyRegistry.IMongoService) private mongoService: IMongoService,
		@inject(DependencyRegistry.IExceptionFilter) private exceptionFilter: IExceptionFilter,
	) {
		this.db = this.mongoService.db;
	}

	async create({ username, email, password }: User): Promise<WithId<Document> | null> {
		await this.db.createCollection(DataBaseCollections.USERS, userSchema);
		return this.db
			.collection('users')
			.insertOne({ username, email, password })
			.then(async ({ insertedId }) => {
				return this.db.collection(DataBaseCollections.USERS).findOne(insertedId);
			})
			.catch((err) => {
				throw new HTTPError(400, 'Document failed validation');
			});
	}

	async find(email: string): Promise<WithId<Document>[]> {
		try {
			return this.db.collection(DataBaseCollections.USERS).find({ email }).toArray();
		} catch (err) {
			throw new Error('Error searching for a user.');
		}
	}
}
