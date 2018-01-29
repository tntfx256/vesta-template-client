import React, { PureComponent } from "react";
import { BaseComponentProps } from "../BaseComponent";

interface IAlertProps extends BaseComponentProps {
    type?: string;
}

export class Alert extends PureComponent<IAlertProps, null> {

    public render() {
        const { type, children } = this.props;

        return (
            <p className={`alert alert-${type}`}>
                {children}
            </p>
        );
    }
}
