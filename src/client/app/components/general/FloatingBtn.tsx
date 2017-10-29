import React, {MouseEventHandler} from "react";
import {BaseComponentProps} from "../BaseComponent";

export interface FloatingBtnProps extends BaseComponentProps {
    icon?: string;
    className?: string;
    onClick?: MouseEventHandler<HTMLButtonElement>;
}

export const FloatingBtn = (props: FloatingBtnProps) => {
    const {className, onClick} = props;
    return (
        <div className={`floating-btn ${className}`}>
            <button type='button' onClick={onClick}>{props.children}</button>
        </div>
    )
};

