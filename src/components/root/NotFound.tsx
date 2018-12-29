import { IRouteComponentProps } from "@vesta/components";
import React, { ComponentType, useEffect } from "react";

interface INotFoundParams {
}

interface INotFoundProps extends IRouteComponentProps<INotFoundParams> {
}

export const NotFound: ComponentType<INotFoundProps> = function (props: INotFoundProps) {

    useEffect(() => {
        props.history.replace("/");
    })


    return (
        <div className="notFound-page page has-navbar" />
    );
}
