import React, {EventHandler, PureComponent} from "react";
import {BaseComponentProps} from "../BaseComponent";
import {Modal} from "./Modal";

export interface DialogProps extends BaseComponentProps {
    title?: string;
    modal?: boolean;
    show: boolean;
    onClose?: EventHandler<any>;
}

export class Dialog extends PureComponent<DialogProps, null> {

    private renderHeader() {
        const {title, onClose} = this.props;
        const titlebar = title ? <h1>{title}</h1> : null;
        const closeBtn = onClose ? <button onClick={close}>X</button> : null;
        return titlebar || closeBtn ? <div className="dialog-header">
            {titlebar}
            {closeBtn}
        </div> : null;
    }

    public render() {
        const {modal, show} = this.props;
        if (!show) return null;
        const header = this.renderHeader();
        const dialog = (
            <div className="dialog-component">
                {header}
                <div className="dialog-content">{this.props.children}</div>
            </div>
        );

        return modal ? <Modal show={true}>{dialog}</Modal> : dialog;
    }
}