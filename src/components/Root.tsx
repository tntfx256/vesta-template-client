import { Html, IComponentProps, IToastMessageProps, Preloader, Sidenav, ToastMessage } from "@vesta/components";
import { Dispatcher } from "@vesta/core";
import { Culture } from "@vesta/culture";
import React, { FunctionComponent, useContext, useEffect } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { IRouteItem } from "../config/route";
import { Store } from "../service/Store";
import { SidenavContent } from "./general/SidenavContent";
import { ErrorBoundary } from "./root/ErrorBoundary";

interface IRootParams {}

interface IRootProps extends IComponentProps, RouteComponentProps<IRootParams> {
  routeItems: IRouteItem[];
}

const Root: FunctionComponent = (props: IRootProps) => {
  const {
    state: { navbar, toast },
    dispatch,
  } = useContext(Store);
  const { code, dir } = Culture.getLocale();

  useEffect(() => {
    // application behaviours
    window.onfocus = toForeground;
    document.addEventListener("resume", toForeground);
    window.onblur = toBackground;
    document.addEventListener("pause", toBackground);
    window.onunload = onExit;
    // toast subscription
    Dispatcher.getInstance().register<IToastMessageProps>("toast", payload => {
      dispatch({ toast: payload });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toastMsg = toast ? <ToastMessage message={toast.message} type={toast.type} onClose={onCloseToast} /> : null;

  return (
    <ErrorBoundary>
      <div id="main-wrapper" className="root-component">
        <Html lang={code} dir={dir} />
        <div id="content-wrapper">{props.children}</div>
        <Sidenav open={navbar}>
          <SidenavContent name="main-sidenav" menuItems={props.routeItems} />
        </Sidenav>
        {toastMsg}
        <Preloader />
      </div>
    </ErrorBoundary>
  );

  function onCloseToast() {
    dispatch({ toast: null });
  }

  function onExit() {
    localStorage.setItem("lastPath", props.location.pathname);
  }

  function toBackground() {
    localStorage.setItem("inBackground", "true");
  }

  function toForeground() {
    localStorage.removeItem("inBackground");
  }
};

export default withRouter<IRootProps, typeof Root>(Root as any);
