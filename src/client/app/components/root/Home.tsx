import React from "react";
import {PageComponent, PageComponentProps, PageComponentState} from "../PageComponent";
import {AuthService} from "../../service/AuthService";

export interface IHomeParams {
}

export interface HomeProps extends PageComponentProps<IHomeParams> {
}

export interface HomeState extends PageComponentState {
}

export class Home extends PageComponent<HomeProps, HomeState> {

    public render() {
        return (
            <div className="page"><h1>Home Component</h1></div>
        );
    }

    static registerPermission(id) {
        AuthService.getInstance().registerPermissions(id);
    }
}
