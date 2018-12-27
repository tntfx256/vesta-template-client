import { CrudMenu, Navbar, PageTitle } from "@vesta/components";
import { Culture } from "@vesta/culture";
import React, { Component, ComponentType } from "react";
import { Route, Switch } from "react-router";
import { HashRouter } from "react-router-dom";
import { getAcl } from "../../service/Acl";
import { transitionTo } from "../../service/transitionTo";
import { IBaseComponentWithRouteProps } from "../BaseComponent";
import { RoleAdd } from "./role/RoleAdd";
import { RoleDetail } from "./role/RoleDetail";
import { RoleEdit } from "./role/RoleEdit";
import { RoleList } from "./role/RoleList";

export interface IAction {
    action?: string;
    id: number;
}

interface IRoleParams {
}

interface IRoleProps extends IBaseComponentWithRouteProps<IRoleParams> {
}

export const Role: ComponentType<IRoleProps> = (props: IRoleProps) => {
    const access = getAcl().getAccessList("role");
    const tr = Culture.getDictionary().translate;

    const addComponent = access.add ?
        <Route path="/role/add" render={transitionTo(RoleAdd, { role: ["add"] })} /> : null;
    const editComponent = access.edit ?
        <Route path="/role/edit/:id" render={transitionTo(RoleEdit, { role: ["edit"] })} /> : null;

    return (
        <div className="page role-page has-navbar">
            <PageTitle title={tr("mdl_role")} />
            <Navbar title={tr("mdl_role")} />
            <h1>{tr("mdl_role")}</h1>
            <CrudMenu path="role" access={access} />
            <div className="crud-wrapper">
                <HashRouter>
                    <Switch>
                        {addComponent}
                        {editComponent}
                        <Route path="/role/detail/:id" render={transitionTo(RoleDetail, { role: ["read"] })} />
                    </Switch>
                </HashRouter>
                <RoleList access={access} />
            </div>
        </div>
    );
}
