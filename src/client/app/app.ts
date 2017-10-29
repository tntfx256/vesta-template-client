import {ClientApp} from "./ClientApp";
import {ConfigService} from "./service/ConfigService";
import {Config} from "./config/config";
import {Culture} from "./cmn/core/Culture";
import {IrLocale} from "./cmn/culture/ir/IrLocale";
import {IrVocabs} from "./cmn/culture/ir/IrVocabs";
import {IrDate} from "./cmn/culture/ir/IrDate";

ConfigService.init(Config);

// locale
Culture.register(Config.locale, IrLocale, IrVocabs, IrDate);

//<cordova>
document.addEventListener('deviceready', startApp, false);
//</cordova>

//<!cordova>
window.addEventListener('DOMContentLoaded', startApp, false);

//</cordova>

function startApp() {
    let client = new ClientApp();
    client.init();
    client.run();
}