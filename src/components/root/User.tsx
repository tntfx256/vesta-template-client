import { CrudMenu, IComponentProps, Navbar, PageTitle } from "@vesta/components";
import { Culture } from "@vesta/culture";
import { AclAction } from "@vesta/services";
import React, { ComponentType } from "react";
import { RouteComponentProps } from "react-router";
import { getAccountInstance } from "../../service/Account";
import { useStore } from "../../service/Store";
import { Go } from "../general/Go";
import { UserAdd } from "./user/UserAdd";
import { UserDetail } from "./user/UserDetail";
import { UserEdit } from "./user/UserEdit";
import { UserList } from "./user/UserList";

// tslint:disable-next-line: no-empty-interface
interface IUserParams {}

interface IUserProps extends IComponentProps, RouteComponentProps<IUserParams> {}

export const User: ComponentType<IUserProps> = (props: IUserProps) => {
  const access = getAccountInstance().getAccessList("user");
  const { dispatch } = useStore();
  // prevent deleting user
  delete access.delete;
  const tr = Culture.getDictionary().translate;

  return (
    <div className="page user-page has-navbar">
      <PageTitle title={tr("mdl_user")} />
      <Navbar title={tr("mdl_user")} onBurgerClick={() => dispatch({ navbar: true })} />
      <CrudMenu path="user" access={access} />
      <div className="crud-wrapper">
        <Go path="/user/add" component={UserAdd} permissions={{ user: [AclAction.Add] }} />
        <Go path="/user/edit/:id" component={UserEdit} permissions={{ user: [AclAction.Edit] }} />
        <Go path="/user/detail/:id" component={UserDetail} permissions={{ user: [AclAction.Read] }} />
        <UserList access={access} />
      </div>
    </div>
  );
};
