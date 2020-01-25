import { Dispatcher, IResponse } from "@vesta/core";
import React, { ComponentType, useContext, useEffect } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { IRole } from "./cmn/models/Role";
import { IUser } from "./cmn/models/User";
import { Go } from "./components/general/Go";
import Root from "./components/Root";
import { NotFound } from "./components/root/NotFound";
import { getRoutes, IRouteItem } from "./config/route";
import { SplashPlugin } from "./plugin/SplashPlugin";
import { getAclInstance } from "./service/Acl";
import { getApiInstance } from "./service/Api";
import { getAuthInstance, isGuest } from "./service/Auth";
import { Notif } from "./service/Notif";
import { Store } from "./service/Store";

// tslint:disable-next-line: no-empty-interface
interface IAppProps {}

export const App: ComponentType = (props: IAppProps) => {
  const { state, dispatch } = useContext(Store);

  useEffect(() => {
    // prevent splash from hiding after timeout; it must be hidden manually
    SplashPlugin.hide();
    Dispatcher.getInstance().register("toast", dispatch);
    getApiInstance()
      .get<IUser, IResponse<IUser>>("me")
      .then(response => {
        const user = (response as any).items[0];
        const auth = getAuthInstance();
        auth.login(user);
        getAclInstance().addRole(user.role as IRole);
        dispatch({ user });
      })
      .catch(err => {
        Notif.getInstance().error(err.message);
      });
    // todo: registerPushNotification();
  }, [dispatch]);

  const routeItems = getRoutes(!isGuest());
  const routes = renderRoutes(routeItems, "");

  return (
    <Router>
      <Root routeItems={routeItems}>
        <Switch>
          {routes}
          <Route component={NotFound} />
        </Switch>
      </Root>
    </Router>
  );

  function renderRoutes(items: IRouteItem[], prefix: string): JSX.Element[] {
    let links: JSX.Element[] = [];
    for (let i = 0, il = items.length; i < il; ++i) {
      const item = items[i];
      if (!item.abstract) {
        const basePath = prefix || "";
        links.push(<Go path={`${basePath}/${item.link}`} key={i} exact={item.exact} component={item.component} />);
      }
      if (item.children) {
        links = links.concat(renderRoutes(item.children, item.link));
      }
    }
    return links;
  }
};
