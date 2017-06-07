import {IClientAppSetting, setting} from "../config/setting";
import {ApiService} from "./ApiService";
import {DateTimeFactory, Dictionary, I18N, ILocale} from "@vesta/core-es5";
import {IR, PersianDate} from "@vesta/culture-ir-es5";
import {GregorianDate, US} from "@vesta/culture-us-es5";

export class I18nService {
    private i18nLocale: ILocale;
    private dictionary: Dictionary;
    private static instance;

    constructor(private Setting: IClientAppSetting, private apiService: ApiService) {
        I18nService.instance = this;
        this.initLocales();
    }

    public static getInstance(): I18nService {
        if (!I18nService.instance) I18nService.instance = new I18nService(setting, ApiService.getInstance());
        return I18nService.instance;
    }

    private initLocales() {
        I18N.registerLocale(IR);
        I18N.registerLocale(US);
        I18N.registerDictionary(IR.code);
        I18N.registerDictionary(US.code);
        DateTimeFactory.register(IR.code, PersianDate);
        DateTimeFactory.register(US.code, GregorianDate);
        //
        this.i18nLocale = I18N.getLocale(this.Setting.locale);
        this.dictionary = I18N.getDictionary(this.Setting.locale);
        //
        // this.apiService.get<any, IVocabs>(`vocabs/${this.Setting.locale}`)
        //     .then(vocabs=>this.dictionary.inject(vocabs));
    }

    public get(property?: string) {
        if (!property) return this.i18nLocale;
        return this.i18nLocale[property];
    }

    public getDictionary(): Dictionary {
        return this.dictionary;
    }
}