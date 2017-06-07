import {IClientAppSetting, setting} from "../config/setting";

export class ConfigService {
    private static instance: ConfigService;

    constructor(private setting: IClientAppSetting) {
        ConfigService.instance = this;
    }

    static init(setting: IClientAppSetting) {
        this.instance = new ConfigService(setting);
    }

    public get<T>(key: string, defaultValue: T = null): T {
        return key in this.setting ? this.setting[key] : defaultValue;
    }

    static getInstance(): ConfigService {
        if (!ConfigService.instance) ConfigService.instance = new ConfigService(setting);
        return ConfigService.instance;
    }
}