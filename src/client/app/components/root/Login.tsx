import React from "react";
import {AuthService} from "../../service/AuthService";
import {PageComponent, PageComponentProps} from "../PageComponent";

export interface ILoginParams {
}

export interface LoginProps extends PageComponentProps<ILoginParams> {
}

export interface LoginState {
}

export class Login extends PageComponent<LoginProps, LoginState> {


    static registerPermission(id) {
        AuthService.getInstance().registerPermissions(id);
    }

    public render() {
        return (
            <div><h1>Login Component</h1></div>
        );
    }
}
