import { Dispatcher, IResponse } from "@vesta/core";
import React, { FunctionComponent, useContext, useEffect } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { IUser } from "./cmn/models/User";
import { Go } from "./components/general/Go";
import Root from "./components/Root";
import { NotFound } from "./components/root/NotFound";
import { getRoutes, IRouteItem } from "./config/route";
import { SplashPlugin } from "./plugin/SplashPlugin";
import { getAccountInstance } from "./service/Account";
import { getApiInstance } from "./service/Api";
import { Notif } from "./service/Notif";
import { Store } from "./service/Store";

// tslint:disable-next-line: no-empty-interface
interface IAppProps {}

export const App: FunctionComponent<IAppProps> = () => {
  const acc = getAccountInstance();
  const { dispatch } = useContext(Store);

  useEffect(() => {
    // prevent splash from hiding after timeout; it must be hidden manually
    SplashPlugin.hide();
    Dispatcher.getInstance().register("toast", dispatch);
    getApiInstance()
      .get<IUser, IResponse<IUser>>("me")
      .then(response => {
        acc.login(response.token);
        dispatch({ user: acc.getUser() });
      })
      .catch(err => {
        Notif.getInstance().error(err.message);
      });
    // todo: registerPushNotification();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const routeItems = getRoutes(!getAccountInstance().isGuest());
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
