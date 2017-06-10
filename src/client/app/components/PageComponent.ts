import React from "react";
import {ApiService} from "../service/ApiService";
import {AuthService} from "../service/AuthService";
import {match} from "react-router";
import {History, Location} from "history";

export interface PageComponentProps<T> {
    match: match<T>;
    location: Location;
    history: History;
}
export interface PageComponentState {
}

export class PageComponent<P, S> extends React.Component<P, S> {
    protected apiService: ApiService = ApiService.getInstance();
    protected authService: AuthService = AuthService.getInstance();
}