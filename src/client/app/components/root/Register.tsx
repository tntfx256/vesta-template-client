import React from "react";
import {Link} from "react-router-dom";
import {PageComponent, PageComponentProps, PageComponentState} from "../PageComponent";
import Navbar from "../general/Navbar";
import {IUser, User} from "../../cmn/models/User";
import {
    FieldValidationMessage,
    getFileUrl,
    ModelValidationMessage,
    shallowClone,
    validationMessage
} from "../../util/Util";
import {FormWrapper} from "../general/form/FormWrapper";
import {FormTextInput} from "../general/form/FormTextInput";
import {Preloader} from "../general/Preloader";
import {IValidationError} from "../../cmn/core/Validator";

export interface RegisterParams {
}

export interface RegisterProps extends PageComponentProps<RegisterParams> {
}

export interface RegisterState extends PageComponentState {
    user: IUser;
    validationErrors: IValidationError;
    showLoader: boolean;
}

export class Register extends PageComponent<RegisterProps, RegisterState> {

    constructor(props: RegisterProps) {
        super(props);
        this.state = {user: {}, validationErrors: null, showLoader: false};
    }

    private onChange = (name: string, value: any) => {
        this.state.user[name] = value;
        this.setState({user: this.state.user});
    }

    private onSubmit = () => {
        let user = new User(this.state.user);
        let validationErrors = user.validate('username', 'password');
        if (validationErrors) {
            return this.setState({validationErrors});
        }
        this.setState({showLoader: true, validationErrors: null});
        this.api.post<IUser>('account', user.getValues('username', 'password'))
            .then(response => {
                this.setState({showLoader: false});
                this.notif.success('msg_register_ok');
                this.props.history.push('/login');
            })
            .catch(error => {
                this.notif.error(error.message);
            })
    }

    public render() {
        const user = shallowClone(this.state.user);
        user.image = getFileUrl(user.image as string);
        const requiredErrorMessage = this.tr('err_required');
        const formErrorsMessages: ModelValidationMessage = {
            username: {
                required: requiredErrorMessage,
                minLength: this.tr('err_min_length', 4),
                maxLength: this.tr('err_max_length', 64)
            },
            password: {
                required: requiredErrorMessage,
                minLength: this.tr('err_min_length', 6),
                assert: this.tr('err_max_length', 16)
            }
        };
        const {validationErrors} = this.state;
        const errors: FieldValidationMessage = validationErrors ? validationMessage(formErrorsMessages, validationErrors) : {};

        return (
            <div className="page register-page has-navbar page-logo-form">
                <Navbar className="navbar-transparent" showBurger={true}/>
                <Preloader show={this.state.showLoader}/>
                <div className="logo-wrapper">
                    <div className="logo-container">
                        <img src="img/vesta-logo.png" alt="Vesta Logo"/>
                    </div>
                </div>
                <FormWrapper onSubmit={this.onSubmit}>
                    <FormTextInput name="username" label={this.tr('fld_username')} value={user.username}
                                   error={errors.username} onChange={this.onChange} placeholder={true} dir="ltr"/>
                    <FormTextInput name="password" label={this.tr('fld_password')} value={user.password}
                                   error={errors.password} onChange={this.onChange} type="password" placeholder={true}
                                   dir="ltr"/>
                    <div className="btn-group">
                        <button type="submit" className="btn btn-primary">{this.tr('register')}</button>
                        <br/>
                        <Link className="btn" to="/login">{this.tr('login')}</Link>
                    </div>
                </FormWrapper>
            </div>
        )
    }
}
