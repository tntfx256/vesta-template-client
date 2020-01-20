import { Registry } from "@vesta/core";
import { isCordova } from "@vesta/core/Platform";
import { Culture, ILocale } from "@vesta/culture";
import { IrDate, IrLocale } from "@vesta/culture-ir";
import { UsDate, UsLocale } from "@vesta/culture-us";
import React from "react";
import { render } from "react-dom";
import AppInit from "./AppInit";
import { SourceApp } from "./cmn/models/User";
import { IrVocabs } from "./cmn/vocabs/IrVocabs";
import { UsVocabs } from "./cmn/vocabs/UsVocabs";
import { config } from "./config";
import { getLog } from "./service/getLog";

Registry.set("sourceApp", SourceApp.EndUser);
// initiating locale
Culture.register(UsLocale, UsVocabs, UsDate);
Culture.register(IrLocale, IrVocabs, IrDate);
loadLocale();

if (isCordova()) {
    document.addEventListener("deviceready", checkScripts, false);
} else {
    window.addEventListener("DOMContentLoaded", checkScripts, false);
}

(window as any).loadLocale = loadLocale;

function loadLocale(code?: string, reload?: boolean): ILocale {
    let locale: ILocale = null;
    let selectedCode: string = code || localStorage.getItem("culture");
    try {
        locale = Culture.getLocale(selectedCode);
    } catch (error) {
        getLog().error(error);
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
            style.setAttribute("href", `css/${locale.dir}.css?v=${Date.now()}`);
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
    if (config.env !== "production") {
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

function startApp() {
    // const theme = createTheme({});
    // setTheme(theme);
    // const [state, dispatch] = useReducer<typeof appReducer>(appReducer, getInitialState());
    render(
        <AppInit />,
        document.getElementById("root")
    );
}
