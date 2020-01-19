import { Registry } from "@vesta/core";
import { Api, IApiConfig, IRequestHeader, Storage } from "@vesta/services";
import { SourceApp } from "../cmn/models/User";
import { config } from "../config";
import { getAuth } from "./Auth";

let instance: Api;

export function getApi(): Api {

    const { api, version } = config;

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
        const token = xhr.getResponseHeader("X-Auth-Token");
        if (token) {
            getAuth().setToken(token);
        }
    }

    function beforeSend<T>(method: string, edge: string, data: T, headers: IRequestHeader) {
        if (data) {
            const sourceApp = Registry.get<SourceApp>("sourceApp");
            (data as any).s = sourceApp;
        }
        if (method !== "UPLOAD") {
            headers["Content-Type"] = "application/json";
        }
        const token = Storage.sync.get<string>("auth-token");
        if (token) {
            headers["X-AUTH-TOKEN"] = token;
        }
    }

}
