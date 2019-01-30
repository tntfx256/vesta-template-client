import { IResponse, isCordova } from "@vesta/core";
import { AclPolicy } from "@vesta/services";
import React, { ComponentType, useEffect, useReducer } from "react";
import { Route, Switch } from "react-router";
import { HashRouter } from "react-router-dom";
import { IUser } from "./cmn/models/User";
import Root from "./components/Root";
import { NotFound } from "./components/root/NotFound";
import { getRoutes, IRouteItem } from "./config/route";
import { KeyboardPlugin } from "./plugin/KeyboardPlugin";
import { SplashPlugin } from "./plugin/SplashPlugin";
import { StatusbarPlugin } from "./plugin/StatusbarPlugin";
import { getAcl } from "./service/Acl";
import { getApi } from "./service/Api";
import { getAuth, isGuest } from "./service/Auth";
import { AppAction, appReducer, getInitialState, IAppAction, IAppState, Store } from "./service/Store";
import { transitionTo } from "./service/Transition";

interface IAppProps { }

export const App: ComponentType = (props: IAppProps) => {

  const routeItems = getRoutes(!isGuest());
  const routes = renderRoutes(routeItems, "");

  // prevent splash from hiding after timeout; it must be hidden manually
  SplashPlugin.show();
  if (isCordova()) {
    KeyboardPlugin.setDefaultProperties();
    StatusbarPlugin.styleDefault();
  }

  const [store, dispatch] = useReducer<IAppState, IAppAction>(appReducer, getInitialState());

  useEffect(() => {
    getApi().get<IUser, IResponse<IUser>>("me")
      .then((response) => {
        const user = response.items[0];
        const auth = getAuth();
        auth.login(user);
        dispatch({ type: AppAction.User, payload: { user } });
      });
  }, [isGuest()]);
  // todo: registerPushNotification();

  return (
    <Store.Provider value={{ store, dispatch }}>
      <HashRouter>
        <Root routeItems={routeItems}>
          <Switch>
            {routes}
            <Route component={NotFound} />
          </Switch>
        </Root>
      </HashRouter>
    </Store.Provider>
  );

  function renderRoutes(items: IRouteItem[], prefix: string) {
    let links = [];
    const routeCount = items.length;
    for (let i = 0, il = routeCount; i < il; ++i) {
      const item = items[i];
      if (!item.abstract) {
        const basePath = prefix ? `/${prefix}` : "";
        links.push((
          <Route path={`${basePath}/${item.link}`} key={i} exact={item.exact}
            render={transitionTo(item.component, item.permissions)} />
        ));
      }
      if (item.children) {
        links = links.concat(renderRoutes(item.children, item.link));
      }
    }
    return links;
  }
};
