import {IClientAppSetting} from "../config/setting";
import {ApiService} from "./ApiService";
import {ILocale, Dictionary, I18N, DateTimeFactory} from "@vesta/core-es5";
import {IR, PersianDate} from "@vesta/culture-ir";
import {US, GregorianDate} from "@vesta/culture-us";

export class I18nService {
    private i18nLocale: ILocale;
    private dictionary: Dictionary;

    constructor(private Setting: IClientAppSetting, private apiService: ApiService) {
        this.initLocales();
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