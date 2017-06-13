import {AuthService} from "./AuthService";
import {ConfigService} from "./ConfigService";

declare let param: (data: any) => string;

type PostData = string | ArrayBuffer | Blob | Document | FormData;

export interface IFileKeyValue {
    [key: string]: File | Blob | Array<File | Blob>;
}

export interface ApiServiceRequest<T> extends Promise<T> {
    xhr?: XMLHttpRequest;
    abort?: () => void;
}

export class ApiService {
    private static instance: ApiService;
    private endPoint: string = '';
    private enableCache: boolean;
    private tokenHeaderKeyName = 'X-Auth-Token';

    constructor(private authService: AuthService) {
        let cfg: ConfigService = ConfigService.getInstance();
        this.endPoint = cfg.get<string>('api');
        this.enableCache = !!cfg.get<{ api: string }>('cache').api;
    }

    private onBeforeSend(xhr: XMLHttpRequest) {
        let token = this.authService.getToken();
        if (token) {
            xhr.setRequestHeader(this.tokenHeaderKeyName, token);
        }
    }

    private onAfterReceive(xhr: XMLHttpRequest) {
        let token = xhr.getResponseHeader(this.tokenHeaderKeyName);
        if (token) {
            this.authService.setToken(token);
                }
    }

    private xhr<T>(method: string, edge: string, data: PostData): ApiServiceRequest<T> {
        let xhr = new XMLHttpRequest();
        let promise: ApiServiceRequest<T> = new Promise<T>((resolve, reject) => {
            xhr.open(method, `${this.endPoint}/${edge}`, true);
            this.onBeforeSend(xhr);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        this.onAfterReceive(xhr);
                        try {
                            let data = JSON.parse(xhr.responseText);
                            data && data.error ? reject(new Error(data.error.message || data.error)) : resolve(<T>data);
                        } catch (e) {
                            reject(xhr.responseText);
        }
                    } else {
                        reject(new Error(xhr.statusText));
    }
        }
            };
            xhr.send(data);
        });
        promise.xhr = xhr;
        promise.abort = () => {
            xhr.abort();
        };
        return promise;
    }

    public get<T>(edge: string): ApiServiceRequest<T> {
        return this.xhr<T>('GET', edge, null);
    }

    public post<T>(edge: string, data: PostData): ApiServiceRequest<T> {
        return this.xhr<T>('POST', edge, data);
    }

    public static toFormData(data: Object): FormData {
        let fd = new FormData();
        for (let keys = Object.keys(data), i = keys.length; i--;) {
            fd.append(keys[i], data[keys[i]]);
        }
        return fd;
    }

    public static getInstance(authService: AuthService = AuthService.getInstance()): ApiService {
        if (!ApiService.instance) {
            ApiService.instance = new ApiService(authService);
    }
        return ApiService.instance;
    }
}
