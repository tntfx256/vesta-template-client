import { isCordova } from "@vesta/core/Platform";
import { Culture, ILocale } from "@vesta/culture";
import { IrDate, IrLocale } from "@vesta/culture-ir";
import { UsDate, UsLocale } from "@vesta/culture-us";
import { createTheme } from "@vesta/theme";
//pollyfill
import "core-js/es6/map";
import "core-js/es6/promise";
import "core-js/es6/set";
import React from 'react';
import { render } from 'react-dom';
import { ThemeProvider } from "react-jss";
import { App } from './app/App';
import { SourceApp } from './app/cmn/models/User';
import { IrVocabs } from './app/cmn/vocabs/IrVocabs';
import { UsVocabs } from './app/cmn/vocabs/UsVocabs';
import { appConfig } from './app/config/appConfig';
import { SplashPlugin } from './app/plugin/SplashPlugin';
import { Config } from './app/service/Config';
import { LogService } from './app/service/LogService';
import "./index.scss";
import { register } from './serviceWorker';


// initial configurations
Config.init(appConfig);
Config.set("sourceApp", SourceApp.EndUser);
Config.set("splashTimeout", 2000);

// initiating locale
Culture.register(UsLocale, UsVocabs, UsDate);
Culture.register(IrLocale, IrVocabs, IrDate);
loadLocale();

if (isCordova()) {
    document.addEventListener("deviceready", checkScripts, false);
} else {
    window.addEventListener("DOMContentLoaded", checkScripts, false);
}

function startApp() {
    const splashTimeout = Config.get<number>("splashTimeout");
    const theme = createTheme({});
    render(
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>,
        document.getElementById("root"),
        () => setTimeout(SplashPlugin.hide, splashTimeout),
    );
    register();
}

(window as any).loadLocale = loadLocale;

function loadLocale(code?: string, reload?: boolean): ILocale {
    let locale: ILocale = null;
    let selectedCode: string = code || localStorage.getItem("culture");
    try {
        locale = Culture.getLocale(selectedCode);
    } catch (e) {
        LogService.error(e.message, "loadLocale", "app.ts");
    }
    if (!locale) {
        locale = Culture.getLocale();
    }
    selectedCode = locale.code;
    localStorage.setItem("culture", selectedCode);
    Culture.setDefault(selectedCode);
    // loading style
    // reloading application
    if (reload) {
        location.reload();
    } else {
        setTimeout(() => {
            document.querySelector("body").setAttribute("dir", locale.dir);
            const style = document.createElement("link");
            style.setAttribute("rel", "stylesheet");
            style.setAttribute("href", `css/app-${locale.dir}.css?v=${Date.now()}`);
            (document.querySelector("head") as HTMLHeadElement).appendChild(style);
        }, 10);
    }
    return locale;
}

// checking whether or not the prerequisite scripts are loaded
function checkScripts() {
    const OFFLINE_ASSUMPTION_DURATION = 30000;
    const SCRIPT_CHECK_INTERVAL = 300;
    const scriptsToCheck: string[] = [];
    if (appConfig.env !== "production") {
        // do not waste time in development
        scriptsToCheck.splice(0, scriptsToCheck.length);
    }
    let scriptCheckCounter = 0;
    (function check() {
        ++scriptCheckCounter;
        if (scriptCheckCounter * SCRIPT_CHECK_INTERVAL > OFFLINE_ASSUMPTION_DURATION) {
            return document.body.classList.add("app-offline");
        }
        for (let i = scriptsToCheck.length; i--;) {
            if (!(scriptsToCheck[i] in window)) {
                // check every 300ms
                return setTimeout(check, 300);
            }
        }
        startApp();
    })();
}