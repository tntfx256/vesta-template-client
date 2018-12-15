import React, { FC } from "react";
import { IBaseComponentWithRouteProps } from "../BaseComponent";
import Navbar from "../general/Navbar";

interface IHomeParams {
}

interface IHomeProps extends IBaseComponentWithRouteProps<IHomeParams> {
}

export const Home: FC<IHomeProps> = function (props: IHomeProps) {

    return (
        <div className="page home-page has-navbar">
            <Navbar title={this.tr("home")} showBurger={true} />
            <h1>Home Component</h1>
        </div>
    );
}
