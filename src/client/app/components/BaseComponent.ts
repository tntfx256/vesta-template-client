import {History, Location} from "history";
import {ReactNode} from "react";

export interface BaseComponentProps {
    location?: Location;
    history?: History;
    children?: ReactNode;
}
