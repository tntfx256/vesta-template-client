import React from "react";
import {render} from "react-dom";
import {Route, Switch} from "react-router";
import {DynamicRouter} from "./components/general/DynamicRouter";
import {AuthService} from "./service/AuthService";
import {AclPolicy} from "./cmn/enum/Acl";
import {Dispatcher} from "./service/Dispatcher";
import {NotFound} from "./components/root/NotFound";
import {Root} from "./components/Root";
import {IUser} from "./cmn/models/User";
import {TransitionService} from "./service/TransitionService";
import {getRoutes, RouteItem} from "./config/route";
import {KeyboardPlugin} from "./plugin/KeyboardPlugin";
import {SplashPlugin} from "./plugin/SplashPlugin";
import {StatusbarPlugin} from "./plugin/StatusbarPlugin";
import {LogService} from "./service/LogService";

export class ClientApp {
    private tz = TransitionService.getInstance().willTransitionTo;
    private auth = AuthService.getInstance();
    private dispatcher = Dispatcher.getInstance();

    //<!cordova>
    private registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js')
                .then((reg: ServiceWorkerRegistration) => {
                    try {
                        reg.update().catch(error => LogService.error(error, 'reg.update', 'ClientApp'));
                    } catch (error) {
                        LogService.error(error, 'registerServiceWorker', 'ClientApp');
                    }
                })
                .catch(err => LogService.error(err.message, 'registerServiceWorker', 'ClientApp'));
        }
        // register push notification
        // NotificationPlugin.getInstance().register(payload => {
        // });
    }

    //</cordova>

    private renderRoutes(routeItems: Array<RouteItem>, prefix: string) {
        let links = [];
        const routeCount = routeItems.length;
        for (let i = 0, il = routeCount; i < il; ++i) {
            const item = routeItems[i];
            if (!item.abstract) {
                let basePath = prefix ? `/${prefix}` : '';
                links.push(<Route path={`${basePath}/${item.link}`} key={i}
                                  exact={item.exact} render={this.tz(item.component, item.permissions)}/>);
            }
            if (item.children) {
                links = links.concat(this.renderRoutes(item.children, item.link));
            }
        }
        return links;
    }

    public init() {
        this.auth.setDefaultPolicy(AclPolicy.Deny);
        // let notifPlugin = NotificationPlugin.getInstance();
        // notifPlugin.updateNotifToken(this.auth.getUser());
        // prevent splash from hiding after timeout; it must hide manually
        SplashPlugin.show();
        //<cordova>
        KeyboardPlugin.setDefaultProperties();
        StatusbarPlugin.styleDefault();
        //</cordova>
        //<!cordova>
        this.registerServiceWorker();
        //</cordova>
        // auth event registration
        this.dispatcher.register<IUser>(AuthService.Events.Update, (user) => {
            // notifPlugin.updateNotifToken(user);
            this.run();
        });
    }

    public run() {
        const routeItems = getRoutes(!this.auth.isGuest());
        let routes = this.renderRoutes(routeItems, '');
        render(
            <DynamicRouter>
                <Root routeItems={routeItems}>
                    <Switch>
                        {routes}
                        <Route component={NotFound}/>
                    </Switch>
                </Root>
            </DynamicRouter>,
            document.getElementById("root"),
            () => {
                // hide splash after 2 seconds
                setTimeout(SplashPlugin.hide, 2000);
            }
        );
    }
}
