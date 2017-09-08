import React from "react";
import {Link} from "react-router-dom";
import {AuthService} from "../../service/AuthService";
import {Dispatcher} from "../../service/Dispatcher";
import {ApiService} from "../../service/ApiService";

export interface SideNavContentProps {
}

export interface SideNavContentState {
}

export class SideNavContent extends React.Component<SideNavContentProps, SideNavContentState> {
    public auth = AuthService.getInstance();
    public dispatcher: Dispatcher = Dispatcher.getInstance();
    public state = {user: null};

    private closeSideNav() {
        this.dispatcher.dispatch('main-sidenav-close', null);
    }

    public componentWillMount() {
        this.dispatcher.register(AuthService.Events.Update, (user) => {
            this.setState({user});
        })
    }

    public logout() {
        ApiService.getInstance().get('/account/logout')
            .then(() => this.auth.logout())
            .catch(() => {
                this.auth.setToken('');
                this.auth.logout()
            }).then(() => this.closeSideNav());
    }

    public join(...strings) {
        let res = '';
        strings.forEach((item) => {
            if (item) {
                res += item.toLocaleString() + ' ';
            }
        });
        return res.trim();
    }

    public render() {
        let content;
        if (this.auth.isGuest()) {
            content = <div>
                <header>
                    <div className="user-image-wrapper">
                        <img src="img/demo/guest.jpg"/>
                    </div>
                    <div className="name-wrapper">
                        <h4>Guest User</h4>
                        <span>Vesta Client Template</span>
                    </div>
                </header>
                <nav>
                    <Link to="login" onClick={this.closeSideNav.bind(this)}>login</Link>
                    <Link to="setting">About</Link>
                </nav>
            </div>;
        } else {
            let user = this.auth.getUser();
            content = <div>
                <header>
                    <div className="user-image-wrapper">
                        <img src="img/demo/user.jpg"/>
                    </div>
                    <div className="name-wrapper">
                        <h4>{this.join(user.firstName, user.lastName)}</h4>
                        <span>{user.email}</span>
                    </div>
                </header>
                <nav>
                    <Link to="setting" onClick={this.closeSideNav.bind(this)}>settings</Link>
                    <a onClick={this.logout.bind(this)}>logout</a>
                </nav>
            </div>;
        }

        return (
            <div id="side-nav-content">{content}</div>
        );
    }
}
