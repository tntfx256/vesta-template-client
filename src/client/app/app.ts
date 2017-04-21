import {ClientApp} from "./target/ClientApp";
import {setting} from "./config/setting";
import {ConfigService} from "./service/ConfigService";

ConfigService.init(setting);

let client = new ClientApp(setting);
client.init();
client.run();