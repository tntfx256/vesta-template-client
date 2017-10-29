import React, {PureComponent} from "react";
import CSSTransitionGroup from "react-addons-css-transition-group";
import {BaseComponentProps} from "../BaseComponent";

export interface ModalProps extends BaseComponentProps {
    show: boolean;
    name?: string;
}

export class Modal extends PureComponent<ModalProps, null> {
    static count = 0;
    // because of this property, this component can not be stateless
    private isOpen = false;

    private updateStatus(show: boolean) {
        if (show) {
            if (!this.isOpen) {
                this.isOpen = true;
                ++Modal.count;
            }
        } else {
            if (this.isOpen) {
                this.isOpen = false;
                --Modal.count;
            }
        }
        if (Modal.count == 1) document.documentElement.classList.add('modal-open');
        else if (!Modal.count) document.documentElement.classList.remove('modal-open');
    }

    public componentWillUnmount() {
        this.updateStatus(false);
    }

    private onModalClicked = (e) => {
        e.stopPropagation();
    }

    public render() {
        let {name, show, children} = this.props;
        this.updateStatus(show);
        let content = show ?
            <div className="modal" onClick={this.onModalClicked}>
                {children}
            </div> : null;

        return (
            <CSSTransitionGroup transitionName={name || 'modal'} transitionAppear={true}
                                transitionAppearTimeout={1} transitionEnterTimeout={300} transitionLeaveTimeout={300}>
                {content}
            </CSSTransitionGroup>
        )
    }
}