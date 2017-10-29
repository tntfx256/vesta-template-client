import * as React from "react";
import {Link} from "react-router-dom";
import {PageComponent, PageComponentProps, PageComponentState} from "../PageComponent";
import Navbar from "../general/Navbar";
import {IContext} from "../../cmn/models/Context";
import {StorageService} from "../../service/StorageService";

export interface AboutParams {
}

export interface AboutProps extends PageComponentProps<AboutParams> {
}

export interface AboutState extends PageComponentState {
}

export class About extends PageComponent<AboutProps, AboutState> {

    constructor(props: AboutProps) {
        super(props);
        this.state = {};
    }

    public render() {
        return (
            <div className="page about-page has-navbar">
                <Navbar title={this.tr('about')} showBurger={true}/>
            </div>
        );
    }
}