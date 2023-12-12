import { Logger, ILogObj } from 'tslog';
import {ILoggerService} from "./logger.service.interface";
import {injectable} from "inversify";
import 'reflect-metadata';

@injectable()
export class LoggerService implements ILoggerService{
    private logger: Logger<ILogObj>;

    constructor() {
        this.logger = new Logger({
            hideLogPositionForProduction: true,
            prettyLogTimeZone: "local",
        });
    }

    log(...args: unknown[]) {
        this.logger.info(...args);
    }

    error(...args: unknown[]) {
        this.logger.error(...args);
    }

    warn(...args: unknown[]) {

    }
}