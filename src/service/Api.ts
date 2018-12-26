import { Registry } from "@vesta/core";
import { Api, IApiOption, IRequestHeader, SyncStorage } from "@vesta/services";
import { SourceApp } from "../cmn/models/User";
import { appConfig } from "../config/appConfig";


let instance: Api;

export function getApi(): Api {

    const sourceApp = Registry.get<SourceApp>("sourceApp");
    const { api, version } = appConfig;

    if (!instance) {
        const endPoint = `${api}/api/${version.api}`;
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
        const token = SyncStorage.get<string>("auth-token");
        if (token) {
            headers["X-AUTH-TOKEN"] = token;
        }
    }

}
