import * as React from "react";
import {Link} from "react-router-dom";
import {PageComponent, PageComponentProps, PageComponentState} from "../PageComponent";
import Navbar from "../general/Navbar";
import {IUser, User} from "../../cmn/models/User";
import {FieldValidationMessage, ModelValidationMessage, Util} from "../../util/Util";
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
        let validationErrors = user.validate('name', 'mobile');
        if (validationErrors) {
            return this.setState({validationErrors});
        }
        this.setState({showLoader: true, validationErrors: null});
        this.api.post<IUser>('account', user.getValues('name', 'mobile'))
            .then(response => {
                this.setState({showLoader: false});
                this.props.history.push('/login');
            })
            .catch(error => {
                this.notif.error(this.tr(error.message));
            })
    }

    public render() {
        const user = Util.shallowClone(this.state.user);
        user.image = Util.getFileUrl(user.image as string);
        const requiredErrorMessage = this.tr('err_required');
        const formErrorsMessages: ModelValidationMessage = {
            name: {
                required: requiredErrorMessage,
                minLength: this.tr('err_min_length', 2),
                maxLength: this.tr('err_max_length', 64)
            },
            mobile: {
                required: requiredErrorMessage,
                type: this.tr('err_phone')
            }
        };
        const {validationErrors} = this.state;
        const errors: FieldValidationMessage = validationErrors ? Util.validationMessage(formErrorsMessages, validationErrors) : {};

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
                    <FormTextInput name="name" label={this.tr('fld_name')} value={user.name}
                                   error={errors.name} onChange={this.onChange} placeholder={true}/>
                    <FormTextInput name="mobile" label={this.tr('fld_mobile')} value={user.mobile}
                                   error={errors.mobile} onChange={this.onChange} type="phone" placeholder={true}/>
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
