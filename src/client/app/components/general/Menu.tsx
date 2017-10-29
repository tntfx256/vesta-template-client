import React from "react";
import {Link} from "react-router-dom";
import {RouteItem} from "../../config/route";
import {BaseComponentProps} from "../BaseComponent";

export interface MenuItem extends RouteItem {

}

export interface MenuProps extends BaseComponentProps {
    name: string;
    items: Array<MenuItem>;
    onClick?: (e: MouseEvent) => boolean;
    horizontal?: boolean;
}

export const Menu = (props: MenuProps) => {
    let {name, items, onClick, horizontal} = props;
    let clickHandler = onClick || null;
    const menuItems = (items || [])
        .map((item: MenuItem, i) => <li key={i}>
            <Link to={`/${item.link}`} onClick={clickHandler}>{item.title}</Link>
        </li>);
    const className = `menu-component ${name} ${horizontal ? 'horizontal' : 'vertical'}`;

    return (
        <nav className={className}>
            <ul>{menuItems}</ul>
        </nav>
    )
};