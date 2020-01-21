import { IRouteComponentProps, Navbar, PageTitle } from "@vesta/components";
import { Culture } from "@vesta/culture";
import React, { ComponentType } from "react";
import { openSidenav } from "../../misc";

interface INotFoundParams {
}

interface INotFoundProps extends IRouteComponentProps<INotFoundParams> {
}

export const NotFound: ComponentType<INotFoundProps> = (props: INotFoundProps) => {

    const tr = Culture.getDictionary().translate;

    return (
        <div className="notFound-page page has-navbar">
            <PageTitle title={tr("notfound")} />
            <Navbar title={tr("notfound")} onBurgerClick={openSidenav} />
            <h1>404 <small>Not found</small></h1>
        </div>
    );
}
