import { IRouteComponentProps } from "@vesta/components";
import React, { FC, useEffect } from "react";

interface IForbiddenParams {
}

interface IForbiddenProps extends IRouteComponentProps<IForbiddenParams> {
}

export const Forbidden: FC<IForbiddenProps> = function (props: IForbiddenProps) {

    useEffect(() => {
        props.history.replace("/");
    })

    return (
        <div className="forbidden-page page has-navbar" />
    );
}
