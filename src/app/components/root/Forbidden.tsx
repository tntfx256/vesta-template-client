import React, { FC, useEffect } from "react";
import { IBaseComponentWithRouteProps } from "../BaseComponent";

interface IForbiddenParams {
}

interface IForbiddenProps extends IBaseComponentWithRouteProps<IForbiddenParams> {
}

export const Forbidden: FC<IForbiddenProps> = function (props: IForbiddenProps) {

    useEffect(() => {
        this.props.history.replace("/");
    })

        return (
            <div className="forbidden-page page has-navbar" />
        );
}
