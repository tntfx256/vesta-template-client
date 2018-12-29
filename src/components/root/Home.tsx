import { IRouteComponentProps, Navbar } from "@vesta/components";
import { Culture } from "@vesta/culture";
import React, { ComponentType } from "react";
import { withTheme } from "react-jss";

interface IHomeParams {
}

interface IHomeProps extends IRouteComponentProps<IHomeParams> {
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
