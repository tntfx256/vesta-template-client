import React, { PureComponent } from "react";
import { BaseComponentProps } from "../../BaseComponent";

export type ChangeEventHandler = (name: string, value: any) => void;

export interface IFormOption {
    id: number;
    title: string;
}

interface IFormWrapperProps extends BaseComponentProps {
    name?: string;
    onSubmit?: (e: Event) => void;
}

export class FormWrapper extends PureComponent<IFormWrapperProps, null> {

    public render() {
        const { name, children } = this.props;

        return (
            <div className="form-wrapper">
                <form name={name} onSubmit={this.onSubmit} noValidate={true}>
                    {children}
                </form>
            </div>
        );
    }

    private onSubmit = (e) => {
        const { onSubmit } = this.props;
        e.preventDefault();
        if (onSubmit) {
            onSubmit(e);
        }
    }
}
