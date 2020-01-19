import { CrudMenu, IComponentProps, Navbar, PageTitle } from "@vesta/components";
import { Culture } from "@vesta/culture";
import React, { ComponentType } from "react";
import { Route, RouteComponentProps, Switch } from "react-router";
import { HashRouter } from "react-router-dom";
import { getAcl } from "../../service/Acl";
import { transitionTo } from "../../service/Transition";
import { UserAdd } from "./user/UserAdd";
import { UserDetail } from "./user/UserDetail";
import { UserEdit } from "./user/UserEdit";
import { UserList } from "./user/UserList";

interface IUserParams {
}

interface IUserProps extends IComponentProps, RouteComponentProps<IUserParams> {
}

export const User: ComponentType<IUserProps> = (props: IUserProps) => {

    const access = getAcl().getAccessList("user");
    // prevent deleting user
    delete access.del;
    const tr = Culture.getDictionary().translate;

    const { add, edit } = access;
    const addUser = add ?
        <Route path="/user/add" render={transitionTo(UserAdd, { user: ["add"] })} /> : null;
    const editUser = edit ?
        <Route path="/user/edit/:id" render={transitionTo(UserEdit, { user: ["edit"] })} /> : null;

    return (
        <div className="page user-page has-navbar">
            <PageTitle title={tr("mdl_user")} />
            <Navbar title={tr("mdl_user")} />
            <h1>{tr("users")}</h1>
            <CrudMenu path="user" access={access} />

            <div className="crud-wrapper">
                <HashRouter>
                    <Switch>
                        {addUser}
                        {editUser}
                        <Route path="/user/detail/:id" render={transitionTo(UserDetail, { user: ["read"] })} />
                    </Switch>
                </HashRouter>
                <UserList access={access} />
            </div>
        </div>
    );
}
