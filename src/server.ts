import { App } from './app';
import { Container, ContainerModule, interfaces } from 'inversify';
import { DependencyRegistry } from './types/DependencyRegistry';
import { ILoggerService, LoggerService } from './services/loggerServices';
import { AuthorizationController, IAuthorizationController } from './controllers/authorizationController';
import { IMongoService } from './database/mongoDb/types';
import { MongoService } from './database/mongoDb/mongoService';
import { UserService } from './services/userService/userService';
import { IUserService } from './services/userService/types/userServiceTypes';
import { UserRepository } from './repositories/userRepository/userRepository';
import { IUserRepository } from './repositories/userRepository/types';
import { IExceptionFilter } from './utils/error-handlers/types';
import { ExceptionFilter } from './utils/error-handlers/exceptionFilter';

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<App>(DependencyRegistry.Application).to(App);
	bind<ILoggerService>(DependencyRegistry.ILoggerService).to(LoggerService).inSingletonScope();
	bind<IAuthorizationController>(DependencyRegistry.IAuthorizationController)
		.to(AuthorizationController)
		.inSingletonScope();
	bind<IMongoService>(DependencyRegistry.IMongoService).to(MongoService);
	bind<IUserService>(DependencyRegistry.IUserService).to(UserService);
	bind<IUserRepository>(DependencyRegistry.IUserRepository).to(UserRepository);
	bind<IExceptionFilter>(DependencyRegistry.IExceptionFilter).to(ExceptionFilter);
});

const bootstrap = (): { app: App; appContainer: Container } => {
	const appContainer = new Container();
	appContainer.load(appBindings);

	const app = appContainer.get<App>(DependencyRegistry.Application);
	app.init();

	return { app, appContainer };
};

export const { app, appContainer } = bootstrap();
