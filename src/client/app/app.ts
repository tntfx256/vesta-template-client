import { IrDate, IrLocale } from "@vesta/culture-ir";
import { ClientApp } from "./ClientApp";
import { SourceApp } from "./cmn/models/User";
import { IrVocabs } from "./cmn/vocabs/IrVocabs";
import { appConfig } from "./config/appConfig";
import { Culture } from "./medium";
import { Config } from "./service/Config";

// initial configurations
Config.init(appConfig);
Config.set("sourceApp", SourceApp.EndUser);
Config.set("splashTimeout", 2000);
Config.set("onesignal-id", "");

// initiating locale
Culture.register(IrLocale, IrVocabs, IrDate);

//<cordova>
document.addEventListener("deviceready", checkScripts, false);
//</cordova>

//<!cordova>
window.addEventListener("DOMContentLoaded", checkScripts, false);
//</cordova>

// checking whether or not the prerequisite scripts are loaded
function checkScripts() {
    const OFFLINE_ASSUMPTION_DURATION = 30000;
    const SCRIPT_CHECK_INTERVAL = 300;
    const scriptsToCheck = [];
    //<!cordova>
    scriptsToCheck.push("OneSignal");
    //</cordova>
    //<development>
    // do not waste time in development
    scriptsToCheck.splice(0, scriptsToCheck.length);
    //</development>
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
    const client = new ClientApp();
    client.init();
    client.run();
}
