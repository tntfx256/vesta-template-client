import { Dispatch, useState as UseStateReact } from "react";
import { config } from "../config";

export function shallowClone<T>(object: T): T {
    if (!object) { return object; }
    // return (JSON.parse(JSON.stringify(object))) as T;
    const clone: T = {} as T;
    for (let keys = Object.keys(object), i = keys.length; i--;) {
        clone[keys[i]] = object[keys[i]];
    }
    return clone;
}

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
        setStateInternal({ ...state, ...newState });
    };

    return [state, setState];
}