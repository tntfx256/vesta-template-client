import { Navbar } from "@vesta/components";
import React, { ComponentType } from "react";
import { withTheme } from "react-jss";
import { IBaseComponentWithRouteProps } from "../BaseComponent";
import { Culture } from "@vesta/culture";

interface IHomeParams {
}

interface IHomeProps extends IBaseComponentWithRouteProps<IHomeParams> {
}

export const Home: ComponentType<IHomeProps> = withTheme((props: IHomeProps) => {
    const tr = Culture.getDictionary().translate;

    return (
        <div className="page home-page has-navbar">
            <Navbar title={tr("home")} showBurger={true} />
            <h1>Home Component!</h1>
        </div>
    );
});
