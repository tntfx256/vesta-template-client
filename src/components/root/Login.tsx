import { Alert, Button, FormWrapper, IComponentProps, MessageType, Preloader, TextInput } from "@vesta/components";
import { IModelValidationMessage, IResponse, IValidationError, validationMessage } from "@vesta/core";
import { Culture } from "@vesta/culture";
import React, { FunctionComponent, useContext } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { IUser, User } from "../../cmn/models/User";
import { getApi } from "../../service/Api";
import { getAuth } from "../../service/Auth";
import { Notif } from "../../service/Notif";
import { Store } from "../../service/Store";
import { useState } from "../../util";

interface ILoginParams {
}

interface ILoginProps extends IComponentProps, RouteComponentProps<ILoginParams> {
}

interface ILoginState {
    user: IUser;
    validationErrors: IValidationError | null;
    loginError: string;
}

export const Login: FunctionComponent<ILoginProps> = (props: ILoginProps) => {

    const { dispatch } = useContext(Store);
    const tr = Culture.getDictionary().translate;
    const api = getApi();
    const auth = getAuth();
    const notif = Notif.getInstance();
    const formErrorsMessages: IModelValidationMessage = {
        password: {
            maxLength: tr("err_max_length", 16),
            minLength: tr("err_min_length", 4),
            required: tr("err_required"),
        },
        username: {
            maxLength: tr("err_max_length", 16),
            minLength: tr("err_min_length", 4),
            required: tr("err_required"),
        },
    };
    // state
    const [state, setState] = useState<ILoginState>({
        loginError: "",
        user: {},
        validationErrors: null,
    });

    const { user, validationErrors, loginError } = state;

    const errors = validationErrors ? validationMessage(formErrorsMessages, validationErrors) : {};
    const loginErr = loginError ? <Alert type={MessageType.Error}>{tr("err_wrong_user_pass")}</Alert> : null;

    return (
        <div className="page login-page has-navbar page-logo-form">
            <div className="logo-wrapper">
                <div className="logo-container">
                    <img src="images/icons/144x144.png" alt="Vesta Logo" />
                </div>
            </div>
            <FormWrapper name={"loginForm"} onSubmit={onSubmit}>
                {loginErr}
                <TextInput name="username" label={tr("fld_username")} value={user.username}
                    error={errors.username} onChange={onChange} />
                <TextInput name="password" label={tr("fld_password")} value={user.password} type="password"
                    error={errors.password} onChange={onChange} />
                <p style={{ textAlign: "end" }}>
                    <Link to="forget">{tr("forget_pass")}</Link>
                </p>
                <div className="btn-group">
                    <Button color="primary" variant="outlined">
                        <Link to="register">{tr("register")}</Link>
                    </Button>
                    <Button type="submit" color="primary" variant="contained">{tr("login")}</Button>
                </div>
            </FormWrapper>
        </div>
    );

    function onChange(name: string, value: string) {
        user[name] = value;
        setState({ user });
    }

    function onSubmit() {
        const userInstance = new User(user);
        const validationResult = userInstance.validate("username", "password");
        if (validationResult) {
            // return setErrors(validationResult);
            return setState({ validationErrors: validationResult });
        }
        Preloader.show();
        // setErrors(null);
        setState({ validationErrors: null, loginError: "" });
        api.post<IUser, IResponse<IUser>>("account/login", userInstance.getValues("username", "password"))
            .then((response) => {
                Preloader.hide();
                auth.login(response.items[0]);
                dispatch({ user: auth.getUser() });
            })
            .catch((error) => {
                Preloader.hide();
                // setLoginError(tr("err_wrong_user_pass"));
                setState({ loginError: tr("err_wrong_user_pass") });
                if (error.message === "err_db_no_record") { return; }
                notif.error(error.message);
            });
    }
};
