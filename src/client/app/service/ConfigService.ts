import {IClientAppSetting, setting} from "../config/setting";

export class ConfigService {
    private static instance: ConfigService;

    constructor(private setting: IClientAppSetting) {
    }

    static init(setting: IClientAppSetting) {
        ConfigService.instance = new ConfigService(setting);
    }

    public get<T>(key: string, defaultValue: T = null): T {
        return key in this.setting ? this.setting[key] : defaultValue;
    }

    public static getInstance(): ConfigService {
        if (!ConfigService.instance) {
            ConfigService.instance = new ConfigService(setting);
        }
        return ConfigService.instance;
    }
}