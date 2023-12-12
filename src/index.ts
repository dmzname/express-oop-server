import {TYPES} from "./types";
import {Container, ContainerModule, interfaces} from "inversify";
import {App} from "./app";
import {LoggerService} from "./logger/logger.service";
import {AuthorizationController} from "./authorization/authorization.controller";
import {ExceptionFilter} from "./errors/exception.filter";
import {ILoggerService} from "./logger/logger.service.interface";
import {IExceptionFilter} from "./errors/exception.filter.interface";
import {IAuthorizationController} from "./authorization/authorization.controller.interface";

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
    bind<App>(TYPES.Application).to(App);
    bind<ILoggerService>(TYPES.ILoggerService).to(LoggerService);
    bind<IExceptionFilter>(TYPES.IExceptionFilter).to(ExceptionFilter);
    bind<IAuthorizationController>(TYPES.IAuthorizationController).to(AuthorizationController);
});

const bootstrap = () => {
    const appContainer = new Container();
    appContainer.load(appBindings);

    const app = appContainer.get<App>(TYPES.Application);
    app.init();

    return {app, appContainer};
}

export const {app, appContainer} = bootstrap();