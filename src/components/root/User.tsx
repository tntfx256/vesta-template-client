import { CrudMenu, IRouteComponentProps, Navbar, PageTitle } from "@vesta/components";
import { Culture } from "@vesta/culture";
import React, { ComponentType } from "react";
import { Route, Switch } from "react-router";
import { HashRouter } from "react-router-dom";
import { openSidenav } from "../../misc";
import { getAclInstance } from "../../service/Acl";
import { UserAdd } from "./user/UserAdd";
import { UserDetail } from "./user/UserDetail";
import { UserEdit } from "./user/UserEdit";
import { UserList } from "./user/UserList";

interface IUserParams {
}

interface IUserProps extends IRouteComponentProps<IUserParams> {
}

export const User: ComponentType<IUserProps> = (props: IUserProps) => {

    const access = getAclInstance().getAccessList("user");
    // prevent deleting user
    delete access.delete;
    const tr = Culture.getDictionary().translate;

    return (
        <div className="page user-page has-navbar">
            <PageTitle title={tr("mdl_user")} />
            <Navbar title={tr("mdl_user")} onBurgerClick={openSidenav} />
            <CrudMenu path="user" access={access} />
            <div className="crud-wrapper">
                <HashRouter>
                    <Switch>
                        {access.add ? <Route path="/user/add" component={UserAdd} /> : null}
                        {access.edit ? <Route path="/user/edit/:id" component={UserEdit} /> : null}
                        {access.detail ? <Route path="/user/detail/:id" component={UserDetail} /> : null}
                    </Switch>
                </HashRouter>
                <UserList access={access} />
            </div>
        </div>
    );
};
