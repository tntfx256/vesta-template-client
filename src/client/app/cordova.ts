import {setting} from "./config/setting";
import {ConfigService} from "./service/ConfigService";
import {CordovaApp} from "./target/CordovaApp";

ConfigService.init(setting);

document.addEventListener('deviceready', onReady, false);

function onReady() {
    let client = new CordovaApp(setting);
    client.init();
    client.run();
}