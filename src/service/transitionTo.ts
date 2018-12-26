import { Acl, IPermissions } from "@vesta/services";
import React, { Attributes, Component, ComponentType, ReactNode } from "react";
import { Forbidden } from "../components/root/Forbidden";
import { getAcl } from "./getAcl";

let idCounter = 1;
let acl = getAcl();


// tslint:disable-next-line:max-line-length
export function transitionTo(componentClass: ComponentType | Component, permissions?: IPermissions, extraProps?: Attributes & any, children?: ReactNode[]) {
    const id = this.idCounter++;
    this.acl.registerPermisions(id.toString(), permissions);
    extraProps = extraProps || {};
    return (props) => {
        return this.acl.hasAccessToState(id) ?
            React.createElement(componentClass as any, { ...props, ...extraProps }, children) :
            React.createElement(Forbidden, props);
    };
}

