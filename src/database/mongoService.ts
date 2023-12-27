import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { IConfigService } from '../common/config/configService/types/configServiceInterface';
import { IMongoService } from './types';
import { ILoggerService } from '../logger/logger.service.interface';
import { MongoClient } from 'mongodb';

@injectable()
export class MongoService implements IMongoService {
	client: MongoClient;

	constructor(
		@inject(TYPES.IConfigService) private configService: IConfigService,
		@inject(TYPES.ILoggerService) private logger: ILoggerService,
	) {
		this.client = new MongoClient(this.configService.get('DB_URL'));
	}

	async connect(): Promise<void> {
		try {
			await this.client.connect();
			this.logger.log('Database connected successfully');
		} catch (error) {
			this.logger.error(error);
		}
	}
}
