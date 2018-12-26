import { Html, Preloader, Sidenav, ToastMessage } from "@vesta/components";
import { Dispatcher } from "@vesta/core";
import { Culture } from "@vesta/culture";
import { SyncStorage } from "@vesta/services";
import React, { Component, ComponentType } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { IUser } from "../cmn/models/User";
import { IRouteItem } from "../config/route";
import { IAppState } from "../misc/AppState";
import { appStore } from "../misc/appStore";
import { getApi } from "../service/Api";
import { AuthEvents, getAuth } from "../service/Auth";
import { SidenavContent } from "./general/SidenavContent";


interface IRootParams { }

interface IRootProps extends RouteComponentProps<IRootParams> {
    routeItems: IRouteItem[];
}

interface IRootState extends IAppState {
}

class Root extends Component<IRootProps, IRootState> {
    private api = getApi()
    private auth = getAuth();
    private dispatcher = Dispatcher.getInstance();
    private lastPathKey = "last-path";

    constructor(props: IRootProps) {
        super(props);
        this.state = appStore.getState();
    }

    public componentDidMount() {
        // registering for user auth status change event
        this.dispatcher.register<IUser>(AuthEvents.Update, (user) => {
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
                <Preloader />
            </div>
        );
    }

    private onExit = () => {
        SyncStorage.set(this.lastPathKey, this.props.location.pathname);
    }

    private toBackground = () => {
        SyncStorage.set("isAppInBackground", true);
    }

    private toForeground = () => {
        SyncStorage.set("isAppInBackground", false);
    }
}

export default withRouter(Root as ComponentType<IRootProps>);
