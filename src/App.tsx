import { IResponse, isCordova } from "@vesta/core";
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
import { getApi } from "./service/Api";
import { getAuth, isGuest } from "./service/Auth";
import { AppAction, appReducer, getInitialState, Store } from "./service/Store";
import { transitionTo } from "./service/Transition";

interface IAppProps { }

export const App: ComponentType = (props: IAppProps) => {

  const routeItems = getRoutes(!isGuest());
  const routes = renderRoutes(routeItems, "");

  if (isCordova()) {
    KeyboardPlugin.setDefaultProperties();
    StatusbarPlugin.styleDefault();
  }

  const [state, dispatch] = useReducer<typeof appReducer>(appReducer, getInitialState());

  useEffect(() => {
    // prevent splash from hiding after timeout; it must be hidden manually
    SplashPlugin.hide();
    getApi().get<IUser, IResponse<IUser>>("me")
      .then((response) => {
        const user = response.items[0];
        const auth = getAuth();
        auth.login(user);
        dispatch({ type: AppAction.User, payload: { user } });
      }).catch((err) => { console.log(err) });
  }, []);
  // todo: registerPushNotification();

  return (
    <Store.Provider value={{ state, dispatch }}>
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
