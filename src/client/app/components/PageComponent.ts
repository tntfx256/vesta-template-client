import {Component} from "react";
import {ApiService} from "../service/ApiService";
import {AuthService} from "../service/AuthService";
import {match} from "react-router";
import {History, Location} from "history";
import {NotificationService} from "../service/NotificationService";

export interface PageComponentProps<T> {
    match: match<T>;
    location: Location;
    history: History;
}

export interface PageComponentState {
}

export class PageComponent<P, S> extends Component<P, S> {

    protected api: ApiService = ApiService.getInstance();
    protected auth: AuthService = AuthService.getInstance();
    protected notification: NotificationService = NotificationService.getInstance();

}