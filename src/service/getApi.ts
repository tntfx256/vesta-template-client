import { Api, IApiOption, IRequestHeader } from "@vesta/services";
import { SourceApp } from "../cmn/models/User";
import { Config } from "./Config";

let instance: Api;

export function getApi(): Api {
    
    const sourceApp = Config.get<SourceApp>("sourceApp");

    if (!instance) {
        const cfg = Config.getConfig();
        const endPoint = `${cfg.api}/api/${cfg.version.api}`;
        const option: IApiOption = {
            hooks: { afterReceive, beforeSend }
        };
        instance = new Api(endPoint, option);
    }
    return instance;


    function afterReceive(method: string, xhr: XMLHttpRequest, edge: string, data: any) {
        const token = xhr.getResponseHeader(this.tokenHeaderKeyName);
        if (token) {
            this.authService.setToken(token);
        }
    }

    function beforeSend(method: string, edge: string, data: any, headers: IRequestHeader) {
        data.sourceApp = sourceApp;
        if (method !== "UPLOAD") {
            headers["Content-Type"] = "application/json";
        }
        const token = this.authService.getToken();
        if (token) {
            headers[this.tokenHeaderKeyName] = token;
        }
    }

}
