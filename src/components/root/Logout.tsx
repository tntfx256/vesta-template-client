import { IComponentProps, Preloader } from "@vesta/components";
import { IResponse } from "@vesta/core";
import { FunctionComponent, useContext, useEffect } from "react";
import { RouteComponentProps } from "react-router";
import { IUser } from "../../cmn/models/User";
import { getAccountInstance } from "../../service/Account";
import { getApiInstance } from "../../service/Api";
import { getLogInstance } from "../../service/Log";
import { Store } from "../../service/Store";

// tslint:disable-next-line: no-empty-interface
interface ILogoutParams { }

interface ILogoutProps extends IComponentProps, RouteComponentProps<ILogoutParams> { }

export const Logout: FunctionComponent<ILogoutProps> = (props: ILogoutProps) => {
  const { dispatch } = useContext(Store);
  const api = getApiInstance();
  const acc = getAccountInstance();

  useEffect(() => {
    if (acc.isGuest()) {
      return props.history.replace("/");
    }
    Preloader.show();
    api
      .get<IUser, IResponse<IUser>>("account/logout")
      .then(response => {
        onAfterLogout(response.items[0]);
      })
      .catch(error => {
        getLogInstance().error(error);
        onAfterLogout({});
      });
    return Preloader.hide;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;

  function onAfterLogout(user: IUser) {
    acc.logout();
    acc.login(user);
    dispatch({ user });
    props.history.replace("/");
  }
};
