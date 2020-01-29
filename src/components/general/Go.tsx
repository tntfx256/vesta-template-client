import { IComponentProps } from "@vesta/components";
import { IPermissions } from "@vesta/services";
import React, { ComponentType } from "react";
import { Route } from "react-router";
import { getAccountInstance } from "../../service/Account";

interface IGoProps extends IComponentProps {
  component: ComponentType;
  exact?: boolean;
  path: string;
  permissions?: IPermissions;
}

export const Go: ComponentType<IGoProps> = (props: IGoProps) => {
  const acc = getAccountInstance();

  return !props.permissions || acc.hasAccess(props.permissions) ? <Route path={props.path} component={props.component} exact={props.exact} /> : null;
};
