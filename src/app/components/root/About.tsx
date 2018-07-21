import React from "react";
import { Link } from "react-router-dom";
import { IContext } from "../../cmn/models/Context";
import { StorageService } from "../../service/StorageService";
import Navbar from "../general/Navbar";
import { IPageComponentProps, PageComponent } from "../PageComponent";

interface IAboutParams {
}

interface IAboutProps extends IPageComponentProps<IAboutParams> {
}

interface IAboutState {
    text: string;
}

export class About extends PageComponent<IAboutProps, IAboutState> {
    private static storageKey = "about";

    constructor(props: IAboutProps) {
        super(props);
        const prevAbout = StorageService.get<IAboutState>(About.storageKey);
        this.state = { text: (prevAbout && prevAbout.text) || "" };
    }

    public componentDidMount() {
        this.api.get<IContext>("context", { query: { key: About.storageKey } })
            .then((response) => {
                if (!response.items.length) { return; }
                const aboutText = response.items[0].value;
                this.setState({ text: aboutText });
                StorageService.set<IAboutState>(About.storageKey, { text: aboutText });
            })
            .catch((error) => {
                this.notif.error(error.message);
            });
    }

    public render() {
        const { text } = this.state;
        const rulesUrl = "https://vesta.bz/terms-rules.html";
        const privacyUrl = "https://vesta.bz/privacy-policy.html";

        return (
            <div className="page about-page has-navbar">
                <Navbar title={this.tr("about")} backLink="/" />
                <div className="logo-wrapper">
                    <img src="img/icons/192x192.png" alt="Vesta Logo" />
                </div>
                <div className="content" dangerouslySetInnerHTML={{ __html: text }} />
                <p className="app-version">
                    Version: <span>1.0.0-rc</span>&nbsp;
                    <span>
                        <a href={rulesUrl} target="_blank">{this.tr("rules")}</a> &&nbsp;
                        <a href={privacyUrl} target="_blank">{this.tr("privacy")}</a>
                    </span>
                </p>
            </div>
        );
    }
}
