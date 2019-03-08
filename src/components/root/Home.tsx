import { IRouteComponentProps, Navbar } from "@vesta/components";
import { Culture } from "@vesta/culture";
import React, { ComponentType, MouseEvent } from "react";
import { withTheme } from "react-jss";
import { AppAction } from "../../misc/AppAction";
import { appStore } from "../../misc/appStore";

interface IHomeParams {
}

interface IHomeProps extends IRouteComponentProps<IHomeParams> {
}

export const Home: ComponentType<IHomeProps> = withTheme((props: IHomeProps) => {
    const tr = Culture.getDictionary().translate;

    return (
        <div className="page home-page has-navbar">
            <Navbar title={tr("home")} onBurgerClick={openSidenav} />
            <h1>home page</h1>
        </div>
    );

    function openSidenav(e: MouseEvent<HTMLElement>) {
        appStore.dispatch({ type: AppAction.Sidenav, payload: { isSidenavOpen: true } });
    }
});
