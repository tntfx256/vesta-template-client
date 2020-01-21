import { Registry } from "@vesta/core";
import { Api, IApiConfig, IRequestHeader, Storage } from "@vesta/services";
import { SourceApp } from "../cmn/models/User";
import { appConfig } from "../config";
import { getAuthInstance } from "./Auth";

let instance: Api = null;
const tokenHeaderKeyName = "X-Auth-Token";

export function getApiInstance(): Api {
  const { api, version } = appConfig;
  const auth = getAuthInstance();

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
    const token = xhr.getResponseHeader(tokenHeaderKeyName);
    if (token) {
      auth.setToken(token);
    }
  }

  function beforeSend<T>(method: string, edge: string, data: T, headers: IRequestHeader) {
    if (data) {
      const sourceApp = Registry.get<SourceApp>("sourceApp");
      (data as any).sourceApp = sourceApp;
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
