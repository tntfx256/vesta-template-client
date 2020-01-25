import { Culture, ILocale } from "@vesta/culture";
import { Dispatch, useState as UseStateReact } from "react";
import { config } from "../config";
import { getLogInstance } from "../service/Log";

export function launchLink(link: string, target: string = "_blank") {
  const a = document.createElement("a");
  a.setAttribute("href", link);
  a.setAttribute("target", target);
  // let dispatch = document.createEvent("HTMLEvents");
  // dispatch.initEvent("click", true, true);
  const ev = new MouseEvent("click");
  a.dispatchEvent(ev);
}

export function getFileUrl(address: string) {
  return `${config.api}/upl/${address || ""}`;
}

export function useState<T>(initialState: T): [T, Dispatch<Partial<T>>] {
  const [state, setStateInternal] = UseStateReact<T>(initialState);

  const setState = (newState: Partial<T>) => {
    setStateInternal(oldState => ({ ...oldState, ...newState }));
  };

  return [state, setState];
}

export function loadLocale(code?: string, reload?: boolean): ILocale {
  let locale: ILocale | null = null;
  let selectedCode = code || localStorage.getItem("culture");
  try {
    locale = Culture.getLocale(selectedCode);
  } catch (error) {
    getLogInstance().error(error);
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
    window.location.reload();
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
export function checkScripts(scriptsToCheck: string[]): Promise<void> {
  const OFFLINE_ASSUMPTION_DURATION = 30000;
  const SCRIPT_CHECK_INTERVAL = 300;

  if (config.env !== "production") {
    // do not waste time in development
    scriptsToCheck.splice(0, scriptsToCheck.length);
    return Promise.resolve();
  }
  return new Promise(resolve => {
    let scriptCheckCounter = 0;
    (function check() {
      ++scriptCheckCounter;
      if (scriptCheckCounter * SCRIPT_CHECK_INTERVAL > OFFLINE_ASSUMPTION_DURATION) {
        return document.body.classList.add("app-offline");
      }
      for (let i = scriptsToCheck.length; i--; ) {
        if (!(scriptsToCheck[i] in window)) {
          // check every 300ms
          return setTimeout(check, 300);
        }
      }
      //   startApp();
      resolve();
    })();
  });
}
