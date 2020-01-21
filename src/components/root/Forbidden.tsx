import { IRouteComponentProps, Navbar, PageTitle } from "@vesta/components";
import { Culture } from "@vesta/culture";
import React, { ComponentType } from "react";
import { openSidenav } from "../../misc";

interface IForbiddenParams {
}

interface IForbiddenProps extends IRouteComponentProps<IForbiddenParams> {
}

export const Forbidden: ComponentType<IForbiddenProps> = (props: IForbiddenProps) => {

    const tr = Culture.getDictionary().translate;

    return (
        <div className="forbidden-page page has-navbar">
            <PageTitle title={tr("err_forbidden")} />
            <Navbar title={tr("err_forbidden")} onBurgerClick={openSidenav} />
            <h1>403 <small>Forbidden</small></h1>
        </div>
    );
};
