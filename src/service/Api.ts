import { Registry } from "@vesta/core";
import { Api, IApiConfig, IRequestHeader, Storage } from "@vesta/services";
import { SourceApp } from "../cmn/models/User";
import { appConfig } from "../config/appConfig";

let instance: Api;

export function getApi(): Api {

    const sourceApp = Registry.get<SourceApp>("sourceApp");
    const { api, version } = appConfig;

    if (!instance) {
        const endpoint = `${api}/api/${version.api}`;
        const option: IApiConfig = {
            endpoint,
            hooks: { afterReceive, beforeSend },
        };
        instance = new Api(option);
    }
    return instance;

    function afterReceive<T>(method: string, xhr: XMLHttpRequest, edge: string, data: T) {
        const token = xhr.getResponseHeader(this.tokenHeaderKeyName);
        if (token) {
            this.authService.setToken(token);
        }
    }

    function beforeSend<T>(method: string, edge: string, data: T, headers: IRequestHeader) {
        (data as any).sourceApp = sourceApp;
        if (method !== "UPLOAD") {
            headers["Content-Type"] = "application/json";
        }
        const token = Storage.sync.get<string>("auth-token");
        if (token) {
            headers["X-AUTH-TOKEN"] = token;
        }
    }

}
