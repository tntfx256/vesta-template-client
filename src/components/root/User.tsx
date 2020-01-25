import { CrudMenu, IComponentProps, Navbar, PageTitle } from "@vesta/components";
import { Culture } from "@vesta/culture";
import React, { ComponentType, useContext } from "react";
import { Route, RouteComponentProps, Switch } from "react-router";
import { HashRouter } from "react-router-dom";
import { getAclInstance } from "../../service/Acl";
import { Store } from "../../service/Store";
import { UserAdd } from "./user/UserAdd";
import { UserDetail } from "./user/UserDetail";
import { UserEdit } from "./user/UserEdit";
import { UserList } from "./user/UserList";

interface IUserParams {}

interface IUserProps extends IComponentProps, RouteComponentProps<IUserParams> {}

export const User: ComponentType<IUserProps> = (props: IUserProps) => {
  const access = getAclInstance().getAccessList("user");
  const { dispatch } = useContext(Store);
  // prevent deleting user
  delete access.delete;
  const tr = Culture.getDictionary().translate;

  return (
    <div className="page user-page has-navbar">
      <PageTitle title={tr("mdl_user")} />
      <Navbar title={tr("mdl_user")} onBurgerClick={() => dispatch({ navbar: true })} />
      <CrudMenu path="user" access={access} />
      <div className="crud-wrapper">
        <HashRouter>
          <Switch>
            {access.add ? <Route path="/user/add" component={UserAdd} /> : null}
            {access.edit ? <Route path="/user/edit/:id" component={UserEdit} /> : null}
            {access.read ? <Route path="/user/detail/:id" component={UserDetail} /> : null}
          </Switch>
        </HashRouter>
        <UserList access={access} />
      </div>
    </div>
  );
};
