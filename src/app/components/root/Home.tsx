import { Navbar } from "@vesta/components";
import React, { ComponentType } from "react";
import { withTheme } from "react-jss";
import { IBaseComponentWithRouteProps } from "../BaseComponent";

interface IHomeParams {
}

interface IHomeProps extends IBaseComponentWithRouteProps<IHomeParams> {
}

export const Home: ComponentType<IHomeProps> = withTheme((props: IHomeProps) => {

    return (
        <div className="page home-page has-navbar">
            <Navbar title={this.tr("home")} showBurger={true} />
            <h1>Home Component</h1>
        </div>
    );
});
