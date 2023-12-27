import { TYPES } from './types';
import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './app';
import { LoggerService } from './logger/logger.service';
import { AuthorizationController } from './features/authorization/authorization.controller';
import { ExceptionFilter } from './errors/exception.filter';
import { UserService } from './entities/User/user.service';
import { ConfigService } from './common/config/configService/configService';
import { MongoService } from './database/mongoService';
import type { IUserService } from './entities/User/types';
import type { ILoggerService } from './logger/logger.service.interface';
import type { IExceptionFilter } from './errors/exception.filter.interface';
import type { IAuthorizationController } from './features/authorization/authorization.controller.interface';
import type { IConfigService } from './common/config/configService/types/configServiceInterface';
import type { IMongoService } from './database/types';

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<App>(TYPES.Application).to(App);
	bind<ILoggerService>(TYPES.ILoggerService).to(LoggerService).inSingletonScope();
	bind<IExceptionFilter>(TYPES.IExceptionFilter).to(ExceptionFilter);
	bind<IAuthorizationController>(TYPES.IAuthorizationController).to(AuthorizationController);
	bind<IUserService>(TYPES.IUserService).to(UserService);
	bind<IConfigService>(TYPES.IConfigService).to(ConfigService).inSingletonScope();
	bind<IMongoService>(TYPES.IMongoService).to(MongoService);
});

const bootstrap = (): { app: App; appContainer: Container } => {
	const appContainer = new Container();
	appContainer.load(appBindings);

	const app = appContainer.get<App>(TYPES.Application);
	app.init();

	return { app, appContainer };
};

export const { app, appContainer } = bootstrap();
