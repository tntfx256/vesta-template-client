import { IComponentProps } from "@vesta/components";
import React, { FunctionComponent, useEffect } from "react";
import { RouteComponentProps } from "react-router";

interface INotFoundParams {
}

interface INotFoundProps extends IComponentProps, RouteComponentProps<INotFoundParams> {
}

export const NotFound: FunctionComponent<INotFoundProps> = (props: INotFoundProps) => {

    useEffect(() => {
        props.history.replace("/");
    }, [])

    return (
        <div className="notFound-page page has-navbar" />
    );
}
