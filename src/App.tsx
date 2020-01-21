import { IResponse, isCordova } from "@vesta/core";
import React, { ComponentType, useContext, useEffect } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { IUser } from "./cmn/models/User";
import { Go } from "./components/general/Go";
import Root from "./components/Root";
import { NotFound } from "./components/root/NotFound";
import { getRoutes, IRouteItem } from "./config/route";
import { KeyboardPlugin } from "./plugin/KeyboardPlugin";
import { SplashPlugin } from "./plugin/SplashPlugin";
import { StatusbarPlugin } from "./plugin/StatusbarPlugin";
import { getAclInstance } from "./service/Acl";
import { getApiInstance } from "./service/Api";
import { getAuthInstance, isGuest } from "./service/Auth";
import { Store } from "./service/Store";

// tslint:disable-next-line: no-empty-interface
interface IAppProps {}

export const App: ComponentType = (props: IAppProps) => {
  const { state, dispatch } = useContext(Store);

  useEffect(() => {
    // todo: registerPushNotification();
    // prevent splash from hiding after timeout; it must be hidden manually
    if (isCordova()) {
      KeyboardPlugin.setDefaultProperties();
      StatusbarPlugin.styleDefault();
    }
    // appStore.subscribe(() => {
    //   setUser(appStore.getState().user);
    // });
  }, []);

  useEffect(() => {
    // prevent splash from hiding after timeout; it must be hidden manually
    SplashPlugin.hide();
    getApiInstance()
      .get<IUser, IResponse<IUser>>("me")
      .then(response => {
        const user = response.items[0];
        const auth = getAuthInstance();
        auth.login(user);
        getAclInstance().addRole(user.role);
        dispatch({ user });
      })
      .catch(err => {
        // log
      });
    // todo: registerPushNotification();
  }, []);

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

  function renderRoutes(items: IRouteItem[], prefix: string) {
    let links = [];
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
