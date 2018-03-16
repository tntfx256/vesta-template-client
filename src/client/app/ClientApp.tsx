import React from "react";
import { render } from "react-dom";
import { Route, Switch } from "react-router";
import { AclPolicy } from "./cmn/enum/Acl";
import { IUser } from "./cmn/models/User";
import { Preloader } from "./components/general/Preloader";
import Root from "./components/Root";
import { NotFound } from "./components/root/NotFound";
import { getRoutes, IRouteItem } from "./config/route";
import { DynamicRouter } from "./medium";
import { KeyboardPlugin } from "./plugin/KeyboardPlugin";
import { NotificationPlugin } from "./plugin/NotificationPlugin";
import { SplashPlugin } from "./plugin/SplashPlugin";
import { StatusbarPlugin } from "./plugin/StatusbarPlugin";
import { AuthService } from "./service/AuthService";
import { ConfigService, IVersion } from "./service/ConfigService";
import { Dispatcher } from "./service/Dispatcher";
import { LogService } from "./service/LogService";
import { TransitionService } from "./service/TransitionService";
import { TranslateService } from "./service/TranslateService";

export class ClientApp {
    private auth = AuthService.getInstance();
    private dispatcher = Dispatcher.getInstance();
    private showAppUpdate = false;
    private tr = TranslateService.getInstance().translate;
    private tz = TransitionService.getInstance().willTransitionTo;

    public init() {
        this.auth.setDefaultPolicy(AclPolicy.Deny);
        const notifPlugin = NotificationPlugin.getInstance();
        notifPlugin.updateNotifToken(this.auth.getUser())
            .catch((error) => LogService.error(error, "init[notifPlugin.updateNotifToken]", "ClientApp"));
        // prevent splash from hiding after timeout; it must be hidden manually
        SplashPlugin.show();
        //<cordova>
        KeyboardPlugin.setDefaultProperties();
        StatusbarPlugin.styleDefault();
        //</cordova>
        this.registerServiceWorker();
        this.registerPushNotification();
        // auth event registration
        this.dispatcher.register<IUser>(AuthService.Events.Update, (user) => {
            notifPlugin.updateNotifToken(user)
                .catch((error) => LogService.error(error, "init[dispatcher::updateNotifToken]", "ClientApp"));
            this.run();
        });
    }

    public run() {
        const routeItems = getRoutes(!this.auth.isGuest());
        const appName = ConfigService.get<string>("name");
        const version = ConfigService.get<IVersion>("version").app;
        const splashTimeout = ConfigService.get<number>("splashTimeout");
        const routes = this.renderRoutes(routeItems, "");

        render(
            <DynamicRouter>
                <Root routeItems={routeItems}>
                    <Switch>
                        {routes}
                        <Route component={NotFound} />
                    </Switch>
                    <Preloader show={this.showAppUpdate} title={this.tr("app_update")} message={`${appName} v${version}`} />
                </Root>
            </DynamicRouter>,
            document.getElementById("root"),
            () => {
                // removing splash screen
                setTimeout(SplashPlugin.hide, splashTimeout);
            },
        );
    }

    private registerPushNotification() {
        NotificationPlugin.getInstance().register((payload) => {
            // push notification payload
        });
    }

    private registerServiceWorker() {
        if (!("serviceWorker" in navigator)) { return; }
        const splashTimeout = ConfigService.get<number>("splashTimeout");
        const swScript = ConfigService.getConfig().sw;
        navigator.serviceWorker.register(`/${swScript}.js`)
            .then((reg: ServiceWorkerRegistration) => {
                reg.addEventListener("updatefound", () => {
                    const installingWorker = reg.installing;
                    installingWorker.addEventListener("statechange", () => {
                        if (installingWorker.state == "installed" && navigator.serviceWorker.controller) {
                            //<production>
                            this.showAppUpdate = true;
                            this.run();
                            setTimeout(() => {
                                LogService.info("Reloading for new version!", "registerServiceWorker", "ClientApp");
                                window.location.reload();
                            }, splashTimeout);
                            //</production>
                            //<development>
                            LogService.info("New version available!", "registerServiceWorker", "ClientApp");
                            //</development>
                        }
                    });
                });
            })
            .catch((error) => LogService.error(error.message, "registerServiceWorker", "ClientApp"));
    }

    private renderRoutes(routeItems: Array<IRouteItem>, prefix: string) {
        let links = [];
        const routeCount = routeItems.length;
        for (let i = 0, il = routeCount; i < il; ++i) {
            const item = routeItems[i];
            if (!item.abstract) {
                const basePath = prefix ? `/${prefix}` : "";
                links.push((
                    <Route path={`${basePath}/${item.link}`} key={i} exact={item.exact}
                        render={this.tz(item.component, item.permissions)} />
                ));
            }
            if (item.children) {
                links = links.concat(this.renderRoutes(item.children, item.link));
            }
        }
        return links;
    }
}
