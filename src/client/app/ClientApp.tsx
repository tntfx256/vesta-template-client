import React, {ComponentClass} from "react";
import {render} from "react-dom";
import {Route, Switch} from "react-router";
import {HashRouter as Router, Link} from "react-router-dom";
import {AuthService} from "./service/AuthService";
import {AclPolicy} from "./cmn/enum/Acl";
import {NotFound} from "./components/root/NotFound";
import {Login} from "./components/root/Login";
import {Home} from "./components/root/Home";
import {Root} from "./components/Root";
import {IClientAppSetting} from "./config/setting";
import {Forbidden} from "./components/root/Forbidden";
import {Dispatcher} from "./service/Dispatcher";
import {IUser} from "./cmn/models/User";
import {About} from "./components/root/About";


export interface MenuItem {
    link: string;
    title: string;
    component: ComponentClass<any>;
    exact?: boolean;
}

export class ClientApp {
    private auth = AuthService.getInstance();
    private menuItems: Array<MenuItem> = [];
    private idCounter = 1;

    constructor(private setting: IClientAppSetting) {
    }

    public init() {
        this.registerServiceWorker();
        this.auth.setDefaultPolicy(AclPolicy.Deny);
        //<cordova>
        Keyboard.hideFormAccessoryBar(true);
        Keyboard.disableScrollingInShrinkView(true);
        Keyboard.shrinkView(true);
        StatusBar.styleDefault();
        //</cordova>
        this.updateMenuItems();
        // auth event registration
        Dispatcher.getInstance().register<{ user: IUser }>(AuthService.Events.Update, (payload) => {
            this.updateMenuItems();
            this.run();
        });
    }

    private registerServiceWorker() {
        // if ('serviceWorker' in navigator) {
        //     navigator.serviceWorker.register('js/sw.js')
        //         .then(registration=> {
        //             console.log('serviceWorker registered', registration);
        //         })
        //         .catch(err=>console.error(err));
        // }
    }

    private updateMenuItems() {
        this.menuItems = this.auth.isGuest() ?
            [
                {link: '', title: 'Home', component: Home, exact: true},
                {link: 'login', title: 'Login', component: Login}
            ] :
            [
                {link: '', title: 'Dashboard', component: Home, exact: true},
                {link: 'about', title: 'About', component: About},
                {link: 'logout', title: 'Logout', component: Home}
            ];
    }

    protected willTransitionTo(componentClass: ComponentClass<any>) {
        let id = this.idCounter++;
        componentClass['registerPermission'](id);
        return (props) => {
            return AuthService.getInstance().hasAccessToState(id) ? React.createElement(componentClass, props) :
                React.createElement(Forbidden, props);
        }
    }

    private getRoutes() {
        return this.menuItems.map((item, index) => (
            <Route path={`/${item.link}`} key={index + 1} exact={item.exact}
                   render={this.willTransitionTo(item.component)}/>
        ));
    }

    public run() {
        let routes = this.getRoutes();
        render(
            <Router>
                <Root menuItems={this.menuItems}>
                    <Switch>
                        {routes}
                        <Route component={NotFound}/>
                    </Switch>
                </Root>
            </Router>,
            document.getElementById("root")
        );
    }
}
