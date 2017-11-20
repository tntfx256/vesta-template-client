import React from "react";
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
    text: string;
}

export class About extends PageComponent<AboutProps, AboutState> {
    private static storageKey = 'about';

    constructor(props: AboutProps) {
        super(props);
        let prevAbout = StorageService.get<AboutState>(About.storageKey);
        this.state = {text: (prevAbout && prevAbout.text) || ''};
    }

    public componentDidMount() {
        this.api.get<IContext>('context', {query: {key: About.storageKey}})
            .then(response => {
                if (!response.items.length) return;
                let aboutText = response.items[0].value;
                this.setState({text: aboutText});
                StorageService.set<AboutState>(About.storageKey, {text: aboutText});
            })
            .catch(error => {
                this.notif.error(error.message);
            })
    }

    public render() {
        const {text} = this.state;
        return (
            <div className="page about-page has-navbar">
                <Navbar title={this.tr('about')} showBurger={true}/>
                <div className="content" dangerouslySetInnerHTML={{__html: text}}/>
            </div>
        );
    }
}