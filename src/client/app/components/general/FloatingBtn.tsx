import React, {PureComponent} from "react";
import {BaseComponentProps} from "../BaseComponent";

export interface FloatingBtnProps extends BaseComponentProps {
    className?: string;
    onClick?: (e) => void;
}

export class FloatingBtn extends PureComponent<FloatingBtnProps, null> {

    public render() {
        const {className, onClick, children} = this.props;

        return (
            <div className={`floating-btn ${className}`} onClick={onClick}>
                {children}
            </div>
        )
    }
}

