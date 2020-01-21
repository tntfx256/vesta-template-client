import { Icon } from "@vesta/components";
import { isCordova, Registry } from "@vesta/core";
import { Culture } from "@vesta/culture";
import { IrDate, IrLocale } from "@vesta/culture-ir";
import { UsDate, UsLocale } from "@vesta/culture-us";
// import "core-js/es6/map";
// import "core-js/es6/promise";
// import "core-js/es6/set";
import React from "react";
import { render } from "react-dom";
import AppInit from "./AppInit";
import { SourceApp } from "./cmn/models/User";
import { IrVocabs } from "./cmn/vocabs/IrVocabs";
import { UsVocabs } from "./cmn/vocabs/UsVocabs";
import { SplashPlugin } from "./plugin/SplashPlugin";
import { checkScripts, loadLocale } from "./util";

// showing splash screen
SplashPlugin.show();
// init icon
(Icon as any).useClassName = false;
// initiating locale
Culture.register(IrLocale, {}, IrDate);
Culture.register(UsLocale, {}, UsDate);
const localePromise = loadLocale();

// Registry.set("sourceApp", SourceApp.EndUser);
Registry.set("sourceApp", SourceApp.Panel);
// initiating locale
Culture.register(UsLocale, UsVocabs, UsDate);
Culture.register(IrLocale, IrVocabs, IrDate);

loadLocale();

if (isCordova()) {
  document.addEventListener("deviceready", startApp, false);
} else {
  window.addEventListener("DOMContentLoaded", startApp, false);
}

(window as any).loadLocale = loadLocale;

function startApp() {
  // checking whether or not the prerequisite scripts are loaded
  const scriptsToCheck: string[] = [];
  checkScripts(scriptsToCheck).then(() => {
    render(<AppInit />, document.getElementById("root"));
  });
}
