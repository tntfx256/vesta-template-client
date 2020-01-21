import { Html, Preloader, Sidenav, ToastMessage } from "@vesta/components";
import { Culture } from "@vesta/culture";
import { Storage } from "@vesta/services";
import React, { ComponentType, PureComponent } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { appConfig } from "../config";
import { IRouteItem } from "../config/route";
import { SidenavContent } from "./general/SidenavContent";
import { ErrorBoundary } from "./root/ErrorBoundary";
import { Dispatcher } from "@vesta/core";

interface IRootParams {}

interface IRootProps extends RouteComponentProps<IRootParams> {
  routeItems: IRouteItem[];
}

interface IRootState extends IAppState {}

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
    // appStore.subscribe(() => {
    //   this.setState(appStore.getState());
    // });
    Dispatcher.getInstance().register("toast", toast => dispatch({ toast }));
  }

  public render() {
    const { user, toast } = this.state;
    const { routeItems } = this.props;
    const { code, dir } = Culture.getLocale();
    const toastMsg = toast ? <ToastMessage message={toast.message} type={toast.type} onClose={this.onCloseToast} /> : null;

    return (
      <ErrorBoundary>
        <Html lang={code} dir={dir} />
        <div id="main-wrapper">
          <Sidenav open={this.state.isSidenavOpen} breakWidth={appConfig.viewport.Medium}>
            <SidenavContent name="main-sidenav" menuItems={routeItems} />
          </Sidenav>
          <div id="content-wrapper">{this.props.children}</div>
        </div>
        {toastMsg}
        <Preloader />
      </ErrorBoundary>
    );
  }

  private onCloseToast = () => {
    dispatch({ toast: null });
  };

  private onExit = () => {
    Storage.sync.set("lastPath", this.props.location.pathname);
  };

  private toBackground = () => {
    Storage.sync.set("inBackground", true);
  };

  private toForeground = () => {
    Storage.sync.set("inBackground", false);
  };
}

export default withRouter(Root as ComponentType<IRootProps>);
