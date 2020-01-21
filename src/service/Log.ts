import { ILogConfig, Log, LogLevel } from "@vesta/services";

let instance: Log;
export function getLogInstance() {
    if (!instance) {
        const logConfig: ILogConfig = {
            driver: console,
            level: LogLevel.Warning,
        };
        instance = new Log(logConfig);
    }
    return instance;
}
