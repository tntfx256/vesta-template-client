import { IComponentProps } from "@vesta/components";
import React, { FC, useEffect } from "react";
import { RouteComponentProps } from "react-router";

interface IForbiddenParams {
}

interface IForbiddenProps extends IComponentProps, RouteComponentProps<IForbiddenParams> {
}

export const Forbidden: FC<IForbiddenProps> = (props: IForbiddenProps) => {

    useEffect(() => {
        props.history.replace("/");
    }, []);

    return (
        <div className="forbidden-page page has-navbar" />
    );
};
