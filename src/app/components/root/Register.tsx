import React from "react";
import { Link } from "react-router-dom";
import { IUser, User } from "../../cmn/models/User";
import { IValidationError } from "../../medium";
import { getFileUrl, IModelValidationMessage, shallowClone, validationMessage } from "../../util/Util";
import { FormWrapper } from "../general/form/FormWrapper";
import { TextInput } from "../general/form/TextInput";
import Navbar from "../general/Navbar";
import { Preloader } from "../general/Preloader";
import { IPageComponentProps, PageComponent } from "../PageComponent";

interface IRegisterParams {
}

interface IRegisterProps extends IPageComponentProps<IRegisterParams> {
}

interface IRegisterState {
    user: IUser;
    validationErrors: IValidationError;
}

export class Register extends PageComponent<IRegisterProps, IRegisterState> {
    private formErrorsMessages: IModelValidationMessage;

    constructor(props: IRegisterProps) {
        super(props);
        this.state = { user: {}, validationErrors: null };
        this.formErrorsMessages = {
            password: {
                assert: this.tr("err_max_length", 16),
                minLength: this.tr("err_min_length", 6),
                required: this.tr("err_required"),
            },
            username: {
                maxLength: this.tr("err_max_length", 64),
                minLength: this.tr("err_min_length", 4),
                required: this.tr("err_required"),
            },
        };
    }

    public render() {
        const { validationErrors } = this.state;
        const user = shallowClone(this.state.user);
        user.image = getFileUrl(user.image as string);
        const errors = validationErrors ? validationMessage(this.formErrorsMessages, validationErrors) : {};

        return (
            <div className="page register-page has-navbar page-logo-form">
                <Navbar className="navbar-transparent" showBurger={true} />
                <div className="logo-wrapper">
                    <div className="logo-container">
                        <img src="img/icons/144x144.png" alt="Vesta Logo" />
                    </div>
                </div>
                <FormWrapper onSubmit={this.onSubmit}>
                    <TextInput name="username" label={this.tr("fld_username")} value={user.username}
                        error={errors.username} onChange={this.onChange} placeholder={true} dir="ltr" />
                    <TextInput name="password" label={this.tr("fld_password")} value={user.password}
                        error={errors.password} onChange={this.onChange} type="password" placeholder={true} dir="ltr" />
                    <div className="agreement">
                        {this.tr("register_accept")}
                        &nbsp;(<a href="https://vesta.bz" target="_blank">{this.tr("rules")}</a>,
                        <a href="https://vesta.bz" target="_blank">{this.tr("privacy")}</a>)
                    </div>
                    <div className="btn-group">
                        <button type="submit" className="btn btn-primary">{this.tr("register")}</button>
                        <Link className="btn btn-outline" to="/">{this.tr("login")}</Link>
                    </div>
                </FormWrapper>
            </div>
        );
    }

    private onChange = (name: string, value: any) => {
        this.state.user[name] = value;
        this.setState({ user: this.state.user });
    }

    private onSubmit = () => {
        const user = new User(this.state.user);
        const validationErrors = user.validate("username", "password");
        if (validationErrors) {
            return this.setState({ validationErrors });
        }
        Preloader.show();
        this.setState({ validationErrors: null });
        this.api.post<IUser>("account", user.getValues("username", "password"))
            .then((response) => {
                Preloader.hide();
                this.notif.success("msg_register_ok");
                this.props.history.push("/");
            })
            .catch((error) => {
                Preloader.hide();
                this.notif.error(error.message);
            });
    }
}
