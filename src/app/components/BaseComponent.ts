import { History, Location } from "history";
import { ReactNode } from "react";
import { match } from "react-router";
import "./BaseComponent.scss";

export interface IBaseComponentProps {
    children?: ReactNode;
}

export interface IBaseComponentWithRouteProps<T> extends IBaseComponentProps {
    history?: History;
    location?: Location;
    match?: match<T>;
}
