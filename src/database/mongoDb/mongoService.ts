import dotenv from 'dotenv';
import { inject, injectable } from 'inversify';
import { IMongoService } from './types';
import { Db, MongoClient } from 'mongodb';
import { DependencyRegistry } from '../../types/DependencyRegistry';
import { ILoggerService } from '../../services/loggerServices';

dotenv.config();

@injectable()
export class MongoService implements IMongoService {
	client: MongoClient;
	private readonly _db: Db;

	constructor(@inject(DependencyRegistry.ILoggerService) private logger: ILoggerService) {
		const dbUrl = process.env.DB_URL;
		if (dbUrl) this.client = new MongoClient(dbUrl);
		this._db = this.client.db(process.env.DB_NAME);
	}

	async connect(): Promise<void> {
		try {
			await this.client.connect();
			this.logger.log('Database connected successfully');
		} catch (error) {
			this.logger.error(error);
		}
	}

	get db(): Db {
		return this._db;
	}
}
