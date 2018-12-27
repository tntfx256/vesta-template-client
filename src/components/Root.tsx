import { Html, Preloader, Sidenav, ToastMessage } from "@vesta/components";
import { Culture } from "@vesta/culture";
import { SyncStorage } from "@vesta/services";
import React, { ComponentType, PureComponent } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { IRouteItem } from "../config/route";
import { IAppState } from "../misc/AppState";
import { appStore } from "../misc/appStore";
import { SidenavContent } from "./general/SidenavContent";
import { ErrorBoundary } from "./root/ErrorBoundary";


interface IRootParams { }

interface IRootProps extends RouteComponentProps<IRootParams> {
    routeItems: IRouteItem[];
}

interface IRootState extends IAppState {
}

class Root extends PureComponent<IRootProps, IRootState> {

    constructor(props: IRootProps) {
        super(props);
        this.state = appStore.getState();
    }

    public componentDidMount() {
        // application behaviours
        window.onfocus = this.toForeground;
        document.addEventListener("resume", this.toForeground);
        window.onblur = this.toBackground;
        document.addEventListener("pause", this.toBackground);
        window.onunload = this.onExit;
        // global state
        appStore.subscribe(() => {
            this.setState(appStore.getState());
        });
    }

    public render() {
        const { user, toast } = this.state;
        const { routeItems } = this.props;
        const { code, dir } = Culture.getLocale();
        const toastMsg = toast ? <ToastMessage message={toast.message} type={toast.type} onClose={this.onCloseToast} /> : null;

        return (
            <ErrorBoundary>
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
            </ErrorBoundary>
        );
    }

    private onCloseToast = () => {
        this.setState({ toast: null });
    }

    private onExit = () => {
        SyncStorage.set("lastPath", this.props.location.pathname);
    }

    private toBackground = () => {
        SyncStorage.set("inBackground", true);
    }

    private toForeground = () => {
        SyncStorage.set("inBackground", false);
    }
}

export default withRouter(Root as ComponentType<IRootProps>);
