import React, { FC, useEffect } from "react";
import { IBaseComponentWithRouteProps } from "../BaseComponent";

interface INotFoundParams {
}

interface INotFoundProps extends IBaseComponentWithRouteProps<INotFoundParams> {
}

export const NotFound: FC<INotFoundProps> = function (props: INotFoundProps) {

    useEffect(() => {
        props.history.replace("/");
    })


    return (
        <div className="notFound-page page has-navbar" />
    );
}
