import { isCordova } from '@vesta/core';
import { AclPolicy } from '@vesta/services';
import React, { FC } from 'react';
import { Route, Switch } from "react-router";
import { HashRouter } from "react-router-dom";
import Root from './components/Root';
import { NotFound } from './components/root/NotFound';
import { getRoutes, IRouteItem } from './config/route';
import { KeyboardPlugin } from './plugin/KeyboardPlugin';
import { SplashPlugin } from './plugin/SplashPlugin';
import { StatusbarPlugin } from './plugin/StatusbarPlugin';
import { getAcl } from './service/Acl';
import { isGuest } from './service/Auth';
import { transitionTo } from './service/Transition';

interface IAppProps { }

export const App: FC = function (props: IAppProps) {
  // const dispatcher = Dispatcher.getInstance();
  const routeItems = getRoutes(!isGuest());
  const routes = renderRoutes(routeItems, "");

  // initiation
  getAcl().setDefaultPolicy(AclPolicy.Allow);
  // prevent splash from hiding after timeout; it must be hidden manually
  SplashPlugin.show();
  if (isCordova()) {
    KeyboardPlugin.setDefaultProperties();
    StatusbarPlugin.styleDefault();
  }
  // todo: registerPushNotification();
  // auth event registration
  // dispatcher.register<IUser>(AuthService.Events.Update, () => run());

  return (
    <HashRouter>
      <Root routeItems={routeItems}>
        <Switch>
          {routes}
          <Route component={NotFound} />
        </Switch>
      </Root>
    </HashRouter>
  )

  function init() {

  }

  function renderRoutes(routeItems: IRouteItem[], prefix: string) {
    let links = [];
    const routeCount = routeItems.length;
    for (let i = 0, il = routeCount; i < il; ++i) {
      const item = routeItems[i];
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
}
