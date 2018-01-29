import React, { Component } from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { ConfigService } from "../../service/ConfigService";
import { Dispatcher } from "../../service/Dispatcher";
import { BaseComponentProps } from "../BaseComponent";
import Navbar from "./Navbar";

export interface ISideNavProps extends BaseComponentProps {
    name: string;
}

export interface ISideNavState {
    open?: boolean;
}

export class Sidenav extends Component<ISideNavProps, ISideNavState> {
    public name = "";
    private dispatcher = Dispatcher.getInstance();
    private transTime = ConfigService.getConfig().transition;

    constructor(props: ISideNavProps) {
        super(props);
        this.state = {};
    }

    public componentWillMount() {
        const name = this.props.name;
        this.dispatcher.register(`${name}-toggle`, this.toggle);
        this.dispatcher.register(`${name}-open`, this.open);
        this.dispatcher.register(`${name}-close`, this.close);
    }

    public render() {
        let navContent = null;
        const { enter, leave } = this.transTime;
        if (this.state.open) {
            navContent = (
                <aside className="sidenav-component">
                    <Navbar className="navbar-transparent" backAction={this.close} />
                    <div onClick={this.close} className="sidenav-backdrop">&nbsp;</div>
                    <div className="sidenav">{this.props.children}</div>
                </aside>
            );
        }
        return (
            <ReactCSSTransitionGroup transitionName="sidenav" transitionEnterTimeout={enter / 2} transitionLeaveTimeout={leave / 2}>
                {navContent}
            </ReactCSSTransitionGroup>
        );
    }

    private close = () => {
        this.setState({ open: false });
        document.documentElement.classList.remove("sidenav-open");
    }

    private open = () => {
        this.setState({ open: true });
        document.documentElement.classList.add("sidenav-open");
    }

    private toggle = () => {
        this.state.open ? this.close() : this.open();
    }
}
