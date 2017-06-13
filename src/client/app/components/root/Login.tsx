import React from "react";
import {Redirect} from "react-router";
import {AuthService} from "../../service/AuthService";
import {PageComponent, PageComponentProps} from "../PageComponent";
import {IQueryResult} from "@vesta/core-es5";
import {IUser} from "../../cmn/models/User";

export interface LoginParams {
}

export interface LoginProps extends PageComponentProps<LoginParams> {
}

export interface LoginState {
    isLoggedIn: boolean;
}

export class Login extends PageComponent<LoginProps, LoginState> {

    constructor(props: LoginProps) {
        super(props);
        this.state = {isLoggedIn: false};
        // binding
        this.handleForm = this.handleForm.bind(this);
    }

    private handleForm(e) {
        e.preventDefault();
        let formData = new FormData(e.target);
        this.api.post<IQueryResult<IUser>>('account/login', formData)
            .then(response => {
                if (response) {
                    this.auth.login(response.items[0]);
                }
                this.setState({isLoggedIn: true});
            })
            .catch(error => {
                this.notification.toast(error.message);
            })
    }

    public render() {
        return this.auth.isGuest() ?
            (
                <div className="page">
                    <form onSubmit={this.handleForm}>
                        <div className="form-group">
                            <label htmlFor="username">Username:
                                <input type="text" name="username" id="username" className="form-control"/>
                            </label>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password:
                                <input type="password" name="password" id="password" className="form-control"/>
                            </label>
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary">Login</button>
                        </div>
                    </form>
                </div>
            ) :
            (<Redirect to="/"/>);
    }

    static registerPermission(id) {
        AuthService.getInstance().registerPermissions(id, {account: ['login']});
    }
}
