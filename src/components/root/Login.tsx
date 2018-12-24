import { Alert, Button, FormWrapper, Preloader, TextInput, Grid, MessageType } from "@vesta/components";
import { IValidationError } from "@vesta/core";
import { Culture } from "@vesta/culture";
import React, { ComponentType, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { withTheme } from "theming";
import { IUser, User } from "../../cmn/models/User";
import { ApiService } from "../../service/ApiService";
import { AuthService } from "../../service/AuthService";
import { NotificationService } from "../../service/NotificationService";
import { IModelValidationMessage, validationMessage } from "../../util/Util";
import { IBaseComponentWithRouteProps } from "../BaseComponent";


interface ILoginParams {
}

interface ILoginProps extends IBaseComponentWithRouteProps<ILoginParams> {
}

export const Login: ComponentType<ILoginProps> = withTheme((props: ILoginProps) => {
    const tr = Culture.getDictionary().translate;
    const api = ApiService.getInstance();
    const auth = AuthService.getInstance();
    const notif = NotificationService.getInstance();
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
    }
    // state
    const [user, setUser] = useState<IUser>({});
    const [validationErrors, setErrors] = useState<IValidationError>(null);
    const [loginError, setLoginError] = useState<string>("");


    useEffect(() => {
        if (!auth.isGuest()) {
            // if it's a user logout first
            props.history.push("/logout");
        }
    })

    const errors = validationErrors ? validationMessage(formErrorsMessages, validationErrors) : {};
    const loginErr = loginError ? <Alert type={MessageType.Error}>{tr("err_wrong_user_pass")}</Alert> : null;

    return (
        <div className="page login-page has-navbar page-logo-form">
            {/* <Navbar className="navbar-transparent" showBurger={true} /> */}
            <div className="logo-wrapper">
                <div className="logo-container">
                    <img src="images/icons/144x144.png" alt="Vesta Logo" />
                </div>
            </div>
            <FormWrapper name="loginForm" onSubmit={onSubmit}>
                {loginErr}

                <TextInput name="username" label={tr("fld_username")} value={user.username}
                    error={errors.username} onChange={onChange} />

                <TextInput name="password" label={tr("fld_password")} value={user.password} type="password"
                    error={errors.password} onChange={onChange} />

                <p style={{ textAlign: "end" }}>
                    <Link to="forget">{tr("forget_pass")}</Link>
                </p>

                <div className="btn-group">
                    <Button type="submit" color="primary" variant="contained">{tr("login")}</Button>
                    <Button color="primary" variant="outlined">
                        <Link to="register">{tr("register")}</Link>
                    </Button>
                </div>
            </FormWrapper>
        </div>
    );


    function onChange(name: string, value: string) {
        user[name] = value;
        setUser(user);
    }

    function onSubmit() {
        const userInstance = new User(user);
        const validationResult = userInstance.validate("username", "password");
        if (validationResult) {
            return setErrors(validationResult);
        }
        Preloader.show();
        setErrors(null);
        api.post<IUser>("account/login", userInstance.getValues("username", "password"))
            .then((response) => {
                Preloader.hide();
                auth.login(response.items[0]);
            })
            .catch((error) => {
                Preloader.hide();
                setLoginError(tr("err_wrong_user_pass"));
                if (error.message == "err_db_no_record") { return; }
                notif.error(error.message);
            });
    }
});
