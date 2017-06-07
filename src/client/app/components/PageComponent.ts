import React from "react";
import {ApiService} from "../service/ApiService";
import {AuthService} from "../service/AuthService";
import {RouteComponentProps} from "react-router";

export interface PageComponentProps<T> extends RouteComponentProps<T> {
}
export interface PageComponentState {
}

export class PageComponent<P, S> extends React.Component<P, S> {
    protected apiService: ApiService = ApiService.getInstance();
    protected authService: AuthService = AuthService.getInstance();
}