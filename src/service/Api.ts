import { Api, IApiConfig, IRequestHeader } from "@vesta/services";
import { config } from "../config";
import { getAccountInstance } from "./Account";

let instance: Api = null;

export function getApiInstance(): Api {
  const { api, version } = config;
  const acc = getAccountInstance();

  if (!instance) {
    const endpoint = `${api}/api/${version.api}`;
    const option: IApiConfig = {
      endpoint,
      hooks: { beforeSend },
    };
    instance = new Api(option);
  }
  return instance;

  function beforeSend<T>(method: string, edge: string, data: T, headers: IRequestHeader) {
    // setting sourceApplication
    const sourceApp = config.sourceApp;
    headers.From = `${sourceApp}`;
    // checking content type
    if (method !== "UPLOAD") {
      headers["Content-Type"] = "application/json";
    }
    // sending auth token
    const token = acc.getToken();
    if (token) {
      headers["X-AUTH-TOKEN"] = token;
    }
  }
}
