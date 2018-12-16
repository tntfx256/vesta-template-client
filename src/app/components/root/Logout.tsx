import { FC, useEffect } from "react";
import { IUser } from "../../cmn/models/User";
import { ApiService } from "../../service/ApiService";
import { AuthService } from "../../service/AuthService";
import { LogService } from "../../service/LogService";
import { IBaseComponentWithRouteProps } from "../BaseComponent";
import { Preloader } from "@vesta/components";

interface ILogoutParams {
}

interface ILogoutProps extends IBaseComponentWithRouteProps<ILogoutParams> {
}

export const Logout: FC<ILogoutProps> = function (props: ILogoutProps) {
    const api = ApiService.getInstance();
    const auth = AuthService.getInstance();


    useEffect(() => {
        if (auth.isGuest()) {
            return props.history.replace("/");
        }
        Preloader.show();
        api.get<IUser>("account/logout")
            .then((response) => {
                onAfterLogout(response.items[0]);
            })
            .catch((error) => {
                LogService.error(error, "componentDidMount", "Logout");
                onAfterLogout({});
            });
        return Preloader.hide;
    });


    return null;


    function onAfterLogout(user: IUser) {
        auth.logout();
        auth.login(user);
        props.history.replace("/");
    }
}
