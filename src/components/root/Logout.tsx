import { IComponentProps, Preloader } from "@vesta/components";
import { IResponse } from "@vesta/core";
import { FunctionComponent, useEffect } from "react";
import { RouteComponentProps } from "react-router";
import { IUser } from "../../cmn/models/User";
import { getApi } from "../../service/Api";
import { getAuth, isGuest } from "../../service/Auth";
import { getLog } from "../../service/getLog";

interface ILogoutParams {
}

interface ILogoutProps extends IComponentProps, RouteComponentProps<ILogoutParams> {
}

export const Logout: FunctionComponent<ILogoutProps> = (props: ILogoutProps) => {
    const api = getApi();
    const auth = getAuth();


    useEffect(() => {
        if (isGuest()) {
            return props.history.replace("/");
        }
        Preloader.show();
        api.get<IUser, IResponse<IUser>>("account/logout")
            .then((response) => {
                onAfterLogout(response.items[0]);
            })
            .catch((error) => {
                getLog().error(error);
                onAfterLogout({});
            });
        return Preloader.hide;
    }, []);


    return null;


    function onAfterLogout(user: IUser) {
        auth.logout();
        auth.login(user);
        props.history.replace("/");
    }
}
