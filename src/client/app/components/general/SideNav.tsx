import React from "react";
import {Dispatcher} from "../../service/Dispatcher";

export interface SideNavProps {
    name: string;
}

export interface SideNavState {
}

export class SideNav extends React.Component<SideNavProps, SideNavState> {
    public name = '';

    constructor(props) {
        super(props);
        this.state = {
            status: false
        };
    }

    public close() {
        this.setState({status: false});
    }

    public open() {
        this.setState({status: true});
    }

    public toggle() {
        this.setState({status: !this.state['status']});
    }

    public componentWillMount() {
        this.name = this.props.name;
        let dispatcher = Dispatcher.getInstance();

        dispatcher.register(this.name + '-toggle', () => {
            this.toggle();
        });
        dispatcher.register(this.name + '-open', () => {
            this.open();
        });
        dispatcher.register(this.name + '-close', () => {
            this.close();
        });

    }

    public render() {
        return (
            <div id={this.name + '-side-nav-component'}>
                <div id="side-nav" className={this.state['status'] ? 'sidenav-open' : ''}>
                    {this.props.children}
                </div>
                <div onClick={this.close.bind(this)} className={this.state['status'] ? 'show' : ''}
                     id="side-nav-blocker">
                </div>
            </div>
        );
    }
}


