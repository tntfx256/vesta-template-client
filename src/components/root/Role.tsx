import { CrudMenu, Navbar, PageTitle } from "@vesta/components";
import { Culture } from "@vesta/culture";
import React, { Component } from "react";
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

export interface IExtPermission {
    [name: string]: IAction[];
}

interface IRoleParams {
}

interface IRoleProps extends IBaseComponentWithRouteProps<IRoleParams> {
}

interface IRoleState {
}

export class Role extends Component<IRoleProps, IRoleState> {
    private access = getAcl().getAccessList("role");
    private tr = Culture.getDictionary().translate;

    constructor(props: IRoleProps) {
        super(props);
        this.state = {};
    }

    public render() {
        const add = this.access.add ?
            <Route path="/role/add" render={transitionTo(RoleAdd, { role: ["add"] })} /> : null;
        const edit = this.access.edit ?
            <Route path="/role/edit/:id" render={transitionTo(RoleEdit, { role: ["edit"] })} /> : null;

        return (
            <div className="page role-page has-navbar">
                <PageTitle title={this.tr("mdl_role")} />
                <Navbar title={this.tr("mdl_role")} />
                <h1>{this.tr("mdl_role")}</h1>
                <CrudMenu path="role" access={this.access} />
                <div className="crud-wrapper">
                    <HashRouter>
                        <Switch>
                            {add}
                            {edit}
                            <Route path="/role/detail/:id" render={transitionTo(RoleDetail, { role: ["read"] })} />
                        </Switch>
                    </HashRouter>
                    <RoleList access={this.access} />
                </div>
            </div>
        );
    }
}
