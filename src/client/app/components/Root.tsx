import React, {Component} from "react";
import {Link} from "react-router-dom";
import {ApiService} from "../service/ApiService";
import {AuthService} from "../service/AuthService";
import {Dispatcher} from "../service/Dispatcher";
import {IUser} from "../cmn/models/User";
import {IQueryResult} from "@vesta/core-es5";
import {ToastMessage} from "./general/ToastMessage";
import {MenuItem} from "../ClientApp";

export interface RootProps {
    menuItems: Array<MenuItem>;
}

interface RootState {
    user?: IUser;
}

export class Root extends Component<RootProps, RootState> {
    private api = ApiService.getInstance();
    private auth = AuthService.getInstance();

    constructor(props: RootProps) {
        super(props);
        this.state = {user: null};
    }

    public componentWillMount() {
        Dispatcher.getInstance().register<{ user: IUser }>(AuthService.Events.Update, (payload) => {
            this.setState({user: payload.user});
        });
        this.api.get<IQueryResult<IUser>>('account')
            .then(response => {
                if (response) {
                    this.auth.login(response.items[0]);
                }
            })
            .catch(err => {
                console.error(err);
            });
    }

    private getMenuItems() {
        return this.props.menuItems.map((item, index) => (
            <Link key={index + 1} to={`/${item.link}`}>{item.title}</Link>));
    }

    public render() {
        let links = this.getMenuItems();
        return (
            <div id="main-wrapper">
                <ToastMessage/>
                <header id="main-header">
                    {links}
                </header>
                <main id="main-content">
                    <div id="content-wrapper">
                        {this.props.children}
                    </div>
                </main>
            </div>
        );
    }
}
