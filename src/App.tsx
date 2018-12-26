import { isCordova } from '@vesta/core';
import React, { FC } from 'react';
import { Route, Switch } from "react-router";
import { HashRouter } from "react-router-dom";
import { AclPolicy } from './cmn/enum/Acl';
import Root from './components/Root';
import { NotFound } from './components/root/NotFound';
import { getRoutes, IRouteItem } from './config/route';
import { KeyboardPlugin } from './plugin/KeyboardPlugin';
import { SplashPlugin } from './plugin/SplashPlugin';
import { StatusbarPlugin } from './plugin/StatusbarPlugin';
import { AuthService } from './service/getAuth';
import { TransitionService } from './service/transitionTo';

interface IAppProps { }

export const App: FC = function (props: IAppProps) {
  const tz = TransitionService.getInstance().transitionTo;
  const auth = AuthService.getInstance();
  // const dispatcher = Dispatcher.getInstance();
  const routeItems = getRoutes(!auth.getUser().id);
  const routes = renderRoutes(routeItems, "");

  // initiation
  AuthService.getInstance().setDefaultPolicy(AclPolicy.Deny);
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
            render={tz(item.component, item.permissions)} />
        ));
      }
      if (item.children) {
        links = links.concat(renderRoutes(item.children, item.link));
      }
    }
    return links;
  }
}
