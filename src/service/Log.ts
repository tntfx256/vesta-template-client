import { IResponse } from "@vesta/core";
import { ILog, LogLevel } from "../cmn/models/Log";
import { appConfig } from "../config/appConfig";
import { getApi } from "./Api";

export class Log {

    public static info(info: ILog | string, method?: string, file?: string) {
        Log.log("log", method, file, info);
    }

    public static warn(warning: ILog | string, method?: string, file?: string) {
        Log.log("warn", method, file, warning);
        Log.save(LogLevel.Warn, warning, method, file);
    }

    public static error(error: ILog | string, method?: string, file?: string) {
        Log.log("error", method, file, error);
        Log.save(LogLevel.Error, error, method, file);
    }

    private static log(logType: string, method: string, file: string, log: any) {
        console[logType](`[${file || ""}::${method || ""}]`, log);
    }

    private static save(level: LogLevel, log: ILog | string, method?: string, file?: string) {
        if (appConfig.env !== "production") { return; }
        const message = "string" === typeof log ? log : log.message;
        // saving log to api server
        getApi().post<ILog, IResponse<ILog>>("log", { level, message, method, file })
            // tslint:disable-next-line:no-console
            .catch((error) => console.error("[LogService::save]", error));
    }
}
