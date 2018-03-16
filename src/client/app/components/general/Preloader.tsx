import React, { PureComponent } from "react";
import { Dialog } from "./Dialog";
import { TranslateService } from "../../service/TranslateService";
import { IBaseComponentProps } from "../BaseComponent";

export const enum PreloaderType { Text = 1, Linear, Circular, Progress }

export interface PreloaderProps extends IBaseComponentProps {
    show: boolean;
    type?: PreloaderType;
    title?: string;
    message?: string;
}

interface IPreloaderState { }

export class Preloader extends PureComponent<PreloaderProps, IPreloaderState> {
    private waitMessage;
    private inProgressMessage;
    private show;

    constructor(props: PreloaderProps) {
        super(props);
        // translate messages
        const tr = TranslateService.getInstance().translate;
        this.waitMessage = tr('msg_inprogress');
        this.inProgressMessage = tr('msg_wait');
        this.state = {};
    }

    public componentWillReceiveProps(newProps: PreloaderProps) {
        if (newProps.show == true) {
            this.show = false;
        }
    }

    public render() {
        let { show, title, message } = this.props;
        title = title || this.waitMessage;
        message = message || this.inProgressMessage;
        const preloader = this.getPreloader();

        if (show && !this.show) {
            setTimeout(() => {
                this.show = true;
                this.forceUpdate();
            }, 900);
        }
        if (!this.show || !show) {
            return <Dialog show={false} />;
        }

        return (
            <Dialog show={true} modalClassName="preloader-modal">
                <div className="preloader">
                    {preloader}
                    <div className="pl-text">
                        <h3 className="pl-title">{title}</h3>
                        {message ? <p className="pl-message">{message}</p> : null}
                    </div>
                </div>
            </Dialog>
        );
    }

    private getPreloader() {
        const { type } = this.props;
        let preloader = null;
        switch (type) {
            default:
                preloader = <div className="pl-circular" />;
                break;
        }
        return (
            <div className="pl-wrapper">
                {preloader}
            </div>
        );
    }
}