import { Icon } from "@vesta/components";
import { Registry } from "@vesta/core";
import { Culture } from "@vesta/culture";
import { IrDate, IrLocale } from "@vesta/culture-ir";
import { UsDate, UsLocale } from "@vesta/culture-us";
import React from "react";
import { render } from "react-dom";
import AppInit from "./AppInit";
import { SourceApp } from "./cmn/models/User";
import { IrVocabs } from "./cmn/vocabs/IrVocabs";
import { UsVocabs } from "./cmn/vocabs/UsVocabs";
import "./index.scss";
import { SplashPlugin } from "./plugin/SplashPlugin";
import * as serviceWorker from "./serviceWorker";
import { loadLocale } from "./util";

// showing splash screen
SplashPlugin.show();
// init icon
(Icon as any).useClassName = false;
// initiating locale
Culture.register(UsLocale, {}, UsDate);
Culture.register(IrLocale, {}, IrDate);

// Registry.set("sourceApp", SourceApp.EndUser);
Registry.set("sourceApp", SourceApp.Panel);
// initiating locale
Culture.register(UsLocale, UsVocabs, UsDate);
Culture.register(IrLocale, IrVocabs, IrDate);

loadLocale();

window.addEventListener("DOMContentLoaded", startApp, false);

(window as any).loadLocale = loadLocale;

function startApp() {
  // checking whether or not the prerequisite scripts are loaded
  // const scriptsToCheck: string[] = [];
  // checkScripts(scriptsToCheck).then(() => {
  render(<AppInit />, document.getElementById("root"));

  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://bit.ly/CRA-PWA
  serviceWorker.unregister();
  // });
}
