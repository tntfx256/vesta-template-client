import { IComponentProps, Preloader } from "@vesta/components";
import { IResponse } from "@vesta/core";
import { FunctionComponent, useEffect } from "react";
import { RouteComponentProps } from "react-router";
import { IUser } from "../../cmn/models/User";
import { getApiInstance } from "../../service/Api";
import { getAuthInstance, isGuest } from "../../service/Auth";
import { getLogInstance } from "../../service/Log";

interface ILogoutParams {}

interface ILogoutProps extends IComponentProps, RouteComponentProps<ILogoutParams> {}

export const Logout: FunctionComponent<ILogoutProps> = (props: ILogoutProps) => {
  const api = getApiInstance();
  const auth = getAuthInstance();

  useEffect(() => {
    if (isGuest()) {
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
  }, []);

  return null;

  function onAfterLogout(user: IUser) {
    auth.logout();
    auth.login(user);
    props.history.replace("/");
  }
};
