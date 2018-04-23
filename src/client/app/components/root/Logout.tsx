import React from "react";
import {PageComponent, IPageComponentProps} from "../PageComponent";
import {IUser} from "../../cmn/models/User";
import {AuthService} from "../../service/AuthService";
import {NotificationPlugin} from "../../plugin/NotificationPlugin";
import {Preloader} from "../general/Preloader";
import {LogService} from "../../service/LogService";

interface ILogoutParams {
}

interface ILogoutProps extends IPageComponentProps<ILogoutParams> {
}

interface ILogoutState {
}

export class Logout extends PageComponent<ILogoutProps, ILogoutState> {
    private notifPlugin = NotificationPlugin.getInstance();

    public componentDidMount() {
        if (this.auth.isGuest()) {
            return this.props.history.replace("/");
        }

        this.notifPlugin.deleteToken()
            .then(() => this.api.get<IUser>('account/logout'))
            .then(response => {
                this.onAfterLogout(response.items[0]);
            })
            .catch((error) => {
                LogService.error(error, "componentDidMount", "Logout");
                this.onAfterLogout({});
            });
    }

    public render() {
        return <Preloader show={true} />;
    }

    private onAfterLogout(user: IUser) {
        this.auth.logout();
        this.auth.login(user);
        this.props.history.replace("/");
    }
}
