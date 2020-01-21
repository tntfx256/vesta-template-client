import { IPermissions } from "@vesta/services";
import React, { Attributes, ComponentType, ReactNode } from "react";
import { Forbidden } from "../components/root/Forbidden";
import { getAcl } from "./Acl";

let idCounter = 1;
const acl = getAcl();

export function transitionTo(componentClass: ComponentType, permissions?: IPermissions, extraProps?: Attributes, children?: ReactNode[]) {
  const id = idCounter++;
  acl.register(id.toString(), permissions);
  extraProps = extraProps || {};
  return props => {
    return acl.hasAccessToState(id.toString())
      ? React.createElement(componentClass, { ...props, ...extraProps }, children)
      : React.createElement(Forbidden, props);
  };
}
