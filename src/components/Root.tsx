import { Html, Navbar, Sidenav, ToastMessage } from "@vesta/components";
import { Dispatcher } from "@vesta/core";
import { Culture } from "@vesta/culture";
import React, { Component, ComponentType } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { IUser } from "../cmn/models/User";
import { IRouteItem } from "../config/route";
import { IAppState } from "../misc/AppState";
import { appStore } from "../misc/appStore";
import { ApiService } from "../service/ApiService";
import { AuthService } from "../service/AuthService";
import { Config } from "../service/Config";
import { LogService } from "../service/LogService";
import { StorageService } from "../service/StorageService";
import { SidenavContent } from "./general/SidenavContent";


interface IRootParams { }

interface IRootProps extends RouteComponentProps<IRootParams> {
    routeItems: IRouteItem[];
}

interface IRootState extends IAppState {
}

class Root extends Component<IRootProps, IRootState> {
    private api = ApiService.getInstance();
    private auth = AuthService.getInstance();
    private dispatcher = Dispatcher.getInstance();
    private lastPathKey = "last-path";

    constructor(props: IRootProps) {
        super(props);
        this.state = appStore.getState();
    }

    public componentDidMount() {
        // registering for user auth status change event
        this.dispatcher.register<IUser>(AuthService.Events.Update, (user) => {
            this.setState({ user });
        });
        // this.dispatcher.register<{ message: string }>("toast", (payload) => {
        //     this.setState({ toast: payload.message });
        // });
        // application in/out checking
        // window.addEventListener("load", this.onLoad);
        // window.addEventListener("focus", this.toForeground);
        window.onfocus = this.toForeground;
        document.addEventListener("resume", this.toForeground);
        // window.addEventListener("blur", this.toBackground);
        window.onblur = this.toBackground;
        document.addEventListener("pause", this.toBackground);
        window.onunload = this.onExit;
        // updating user information from API
        // updating user information from API
        this.api.get<IUser>("me")
            .then((response) => this.auth.login(response.items[0]))
            .catch((err) => LogService.error(err, "componentDidMount", "Root"));
        // redux
        appStore.subscribe(() => {
            this.setState({ ...appStore.getState() });
        })
    }

    public render() {
        const { user, toast } = this.state;
        const { routeItems } = this.props;
        const { code, dir } = Culture.getLocale();
        const toastMsg = toast ? <ToastMessage message={toast.message} type={toast.type} /> : null;

        return (
            <div id="main-wrapper" className="root-component">
                <Html lang={code} dir={dir} />
                <div id="content-wrapper">
                    {this.props.children}
                </div>
                <Sidenav>
                    <SidenavContent name="main-sidenav" user={user} menuItems={routeItems} />
                </Sidenav>
                {toastMsg}
            </div>
        );
    }

    private onExit = () => {
        StorageService.set(this.lastPathKey, this.props.location.pathname);
    }

    private toBackground = () => {
        Config.set("isAppInBackground", true);
    }

    private toForeground = () => {
        Config.set("isAppInBackground", false);
    }
}

export default withRouter(Root as ComponentType<IRootProps>);
