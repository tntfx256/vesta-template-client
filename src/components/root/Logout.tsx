import { IRouteComponentProps, Preloader } from "@vesta/components";
import { IResponse } from "@vesta/core";
import { FC, useEffect } from "react";
import { IUser } from "../../cmn/models/User";
import { getApi } from "../../service/Api";
import { getAuth, isGuest } from "../../service/Auth";
import { getLog } from "../../service/getLog";

interface ILogoutParams {
}

interface ILogoutProps extends IRouteComponentProps<ILogoutParams> {
}

export const Logout: FC<ILogoutProps> = function (props: ILogoutProps) {
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
    });


    return null;


    function onAfterLogout(user: IUser) {
        auth.logout();
        auth.login(user);
        props.history.replace("/");
    }
}
