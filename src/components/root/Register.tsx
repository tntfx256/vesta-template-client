import { Button, FormWrapper, IRouteComponentProps, Preloader, TextInput } from "@vesta/components";
import { IModelValidationMessage, IResponse, IValidationError, validationMessage } from "@vesta/core";
import { Culture } from "@vesta/culture";
import React, { ComponentType, useState } from "react";
import { Link } from "react-router-dom";
import { withTheme } from "theming";
import { IUser, User } from "../../cmn/models/User";
import { getApi } from "../../service/Api";
import { Notif } from "../../service/Notif";
import { getFileUrl } from "../../util/Util";


interface IRegisterParams {
}

interface IRegisterProps extends IRouteComponentProps<IRegisterParams> {
}

export const Register: ComponentType<IRegisterProps> = withTheme((props: IRegisterProps) => {
    const tr = Culture.getDictionary().translate;
    const api = getApi();
    const notif = Notif.getInstance()
    const formErrorsMessages: IModelValidationMessage = {
        password: {
            assert: tr("err_max_length", 16),
            minLength: tr("err_min_length", 6),
            required: tr("err_required"),
        },
        username: {
            maxLength: tr("err_max_length", 64),
            minLength: tr("err_min_length", 4),
            required: tr("err_required"),
        },
    };
    // state
    const [user, setUser] = useState<IUser>({});
    const [validationErrors, setErrors] = useState<IValidationError>(null);

    user.image = getFileUrl(user.image as string);
    const errors = validationErrors ? validationMessage(formErrorsMessages, validationErrors) : {};

    return (
        <div className="page register-page has-navbar page-logo-form">
            <div className="logo-wrapper">
                <div className="logo-container">
                    <img src="images/icons/144x144.png" alt="Vesta Logo" />
                </div>
            </div>
            <FormWrapper onSubmit={onSubmit}>
                <TextInput name="username" label={tr("fld_username")} value={user.username}
                    error={errors.username} onChange={onChange} dir="ltr" />
                <TextInput name="password" label={tr("fld_password")} value={user.password}
                    error={errors.password} onChange={onChange} type="password" dir="ltr" />
                <div className="agreement">
                    {tr("register_accept")}
                    &nbsp;(<a href="https://vesta.bz" target="_blank">{tr("rules")}</a>,
                        <a href="https://vesta.bz" target="_blank">{tr("privacy")}</a>)
                    </div>
                <div className="btn-group">
                    <Button color="primary" type="button">
                        <Link to="/">{tr("login")}</Link>
                    </Button>
                    <Button color="primary" variant="contained">{tr("register")}</Button>
                </div>
            </FormWrapper>
        </div>
    );


    function onChange(name: string, value: any) {
        user[name] = value;
        setUser(user);
    }

    function onSubmit() {
        const userModel = new User(user);
        const validationErrors = userModel.validate("username", "password");
        if (validationErrors) {
            setErrors(validationErrors);
        }
        Preloader.show();
        setErrors(null);
        api.post<IUser, IResponse<IUser>>("account", userModel.getValues("username", "password"))
            .then((response) => {
                Preloader.hide();
                notif.success("msg_register_ok");
                props.history.push("/");
            })
            .catch((error) => {
                Preloader.hide();
                notif.error(error.message);
            });
    }
});
