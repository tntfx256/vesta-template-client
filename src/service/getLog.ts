import { ILogConfig, Log, LogLevel } from "@vesta/services";

let instance: Log;
export function getLog() {
    if (!instance) {
        const logConfig: ILogConfig = {
            level: LogLevel.Warning,
            driver: console
        };
        instance = new Log(logConfig);
    }
    return instance;
}

