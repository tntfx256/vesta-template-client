import React from "react";
import {PageComponent, PageComponentProps, PageComponentState} from "../PageComponent";
import {AuthService} from "../../service/AuthService";

export interface IAboutParams {
}

export interface AboutProps extends PageComponentProps<IAboutParams> {
}

export interface AboutState extends PageComponentState {
}

export class About extends PageComponent<AboutProps, AboutState> {

    public render() {
        return (
            <div className="page"><h1>About Component</h1></div>
        );
    }

    static registerPermission(id) {
        AuthService.getInstance().registerPermissions(id);
    }
}