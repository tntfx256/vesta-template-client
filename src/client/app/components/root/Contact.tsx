import React from "react";
import {PageComponent, PageComponentProps, PageComponentState} from "../PageComponent";
import {FormWrapper} from "../general/form/FormWrapper";
import {Contact as ContactModel, IContact} from "../../cmn/models/Contact";
import {FormTextInput} from "../general/form/FormTextInput";
import {FormTextArea} from "../general/form/FormTextArea";
import {FieldValidationMessage, ModelValidationMessage, unicodeDigit, validationMessage} from "../../util/Util";
import Navbar from "../general/Navbar";
import {Preloader} from "../general/Preloader";
import {IValidationError} from "../../cmn/core/Validator";
import {IContext} from "../../cmn/models/Context";
import {StorageService} from "../../service/StorageService";

export interface ContactParams {
}

export interface ContactProps extends PageComponentProps<ContactParams> {
}

export interface ContactState extends PageComponentState {
    contactInfo?: IContact;
    validationErrors?: IValidationError;
    showLoader?: boolean;
    text?: string;
}

export class Contact extends PageComponent<ContactProps, ContactState> {
    private static storageKey = 'contact';

    constructor(props: ContactProps) {
        super(props);
        let prevContact = StorageService.get<ContactState>(Contact.storageKey);
        this.state = {
            contactInfo: {},
            validationErrors: null,
            showLoader: false,
            text: (prevContact && prevContact.text) || ''
        };
    }

    public componentDidMount() {
        this.api.get<IContext>('context', {query: {key: Contact.storageKey}})
            .then(response => {
                if (!response.items.length) return;
                let contactText = response.items[0].value;
                this.setState({text: contactText});
                StorageService.set<ContactState>(Contact.storageKey, {text: contactText});
            })
            .catch(error => {
                this.notif.error(error.message);
            })
    }

    public onSubmit = (model) => {
        let contactInfo = new ContactModel(model);
        contactInfo.phone = unicodeDigit(contactInfo.phone);
        let validationErrors = contactInfo.validate();
        if (validationErrors) {
            return this.setState({validationErrors});
        }
        this.setState({showLoader: true, validationErrors: null});
        this.api.post<IContact>('contact', contactInfo.getValues())
            .then(response => {
                this.setState({showLoader: false});
                this.props.history.push('/');
            })
            .catch(error => {
                this.setState({showLoader: false, validationErrors: error.violations});
                this.notif.error(error.message);
            })
    }

    public onChange = (key, value) => {
        this.state.contactInfo[key] = value;
        this.setState({contactInfo: this.state.contactInfo});
    }

    public render() {
        const {contactInfo, text, validationErrors} = this.state;
        const formErrorsMessages: ModelValidationMessage = {
            name: {
                required: this.tr('err_required')
            },
            phone: {
                required: this.tr('err_required'),
                type: this.tr('err_phone')
            },
            title: {
                required: this.tr('err_required'),
                minLength: this.tr('err_min_length', 4),
                maxLength: this.tr('err_max_length'),
            },
            content: {
                required: this.tr('err_required'),
                minLength: this.tr('err_min_length'),
                maxLength: this.tr('err_max_length'),
            }
        };
        let errors: FieldValidationMessage = validationErrors ? validationMessage(formErrorsMessages, validationErrors) : {};

        return (
            <div className="page contact-page has-navbar">
                <Navbar title={this.tr('contact_us')} showBurger={true}/>
                <Preloader show={this.state.showLoader}/>
                <div className="content" dangerouslySetInnerHTML={{__html: text}}/>
                <FormWrapper name="contactForm" onSubmit={this.onSubmit}>
                    <FormTextInput label={this.tr('fld_name')} onChange={this.onChange} name="name" placeholder={true}
                                   value={contactInfo.name} error={errors.name}/>
                    <FormTextInput label={this.tr('fld_phone')} onChange={this.onChange} name="phone" placeholder={true}
                                   value={contactInfo.phone} error={errors.phone} dir="ltr"/>
                    <FormTextInput label={this.tr('fld_title')} onChange={this.onChange} name="title" placeholder={true}
                                   value={contactInfo.title} error={errors.title}/>
                    <FormTextArea label={this.tr('fld_content')} onChange={this.onChange} name="content"
                                  value={contactInfo.content} error={errors.content} placeholder={true}/>
                    <div className="tab-header stick-btm">
                        <button type="submit" className="btn btn-primary">{this.tr('submit')}</button>
                    </div>
                </FormWrapper>
            </div>
        );
    }
}
