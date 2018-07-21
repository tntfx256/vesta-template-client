import React from "react";
import { IContext } from "../../cmn/models/Context";
import { ISupport, Support as SupportModel } from "../../cmn/models/Support";
import { IValidationError, sanitizePhoneNumber } from "../../medium";
import { StorageService } from "../../service/StorageService";
import { IFieldValidationMessage, IModelValidationMessage, validationMessage } from "../../util/Util";
import { FormTextArea } from "../general/form/FormTextArea";
import { FormTextInput } from "../general/form/FormTextInput";
import { FormWrapper } from "../general/form/FormWrapper";
import { Icon } from "../general/Icon";
import Navbar from "../general/Navbar";
import { Preloader } from "../general/Preloader";
import { IPageComponentProps, PageComponent } from "../PageComponent";

interface ISupportParams {
}

interface ISupportProps extends IPageComponentProps<ISupportParams> {
}

interface ISupportState {
    showLoader?: boolean;
    supportInfo: ISupport;
    text: string;
    validationErrors?: IValidationError;
}

export class Support extends PageComponent<ISupportProps, ISupportState> {
    private static storageKey = "support";
    private formErrorsMessages: IModelValidationMessage;

    constructor(props: ISupportProps) {
        super(props);
        const prevContact = StorageService.get<ISupportState>(Support.storageKey);
        this.state = { supportInfo: {}, text: (prevContact && prevContact.text) || "" };
        this.formErrorsMessages = {
            content: {
                minLength: this.tr("err_min_length", 10),
                required: this.tr("err_required"),
            },
            phone: {
                type: this.tr("err_phone"),
            },
            title: {
                maxLength: this.tr("err_max_length", 255),
                minLength: this.tr("err_min_length", 4),
                required: this.tr("err_required"),
            },
        };
    }

    public componentDidMount() {
        this.api.get<IContext>("context", { query: { key: Support.storageKey } })
            .then((response) => {
                if (!response.items.length) { return; }
                const contactText = response.items[0].value;
                this.setState({ text: contactText });
                StorageService.set(Support.storageKey, { text: contactText });
            })
            .catch((error) => {
                this.notif.error(error.message);
            });
    }

    public render() {
        const { supportInfo, text, validationErrors } = this.state;
        const errors = validationErrors ? validationMessage(this.formErrorsMessages, validationErrors) : {};

        return (
            <div className="page contact-page has-navbar">
                <Navbar title={this.tr("contact_us")} backLink="/" />
                <Preloader show={this.state.showLoader} />
                <FormWrapper name="contactForm" onSubmit={this.onSubmit}>
                    <FormTextInput label={this.tr("fld_phone")} onChange={this.onChange} name="phone"
                        placeholder={true} value={supportInfo.phone} error={errors.phone} dir="ltr" />
                    <FormTextInput label={this.tr("fld_title")} onChange={this.onChange} name="title"
                        placeholder={true} value={supportInfo.title} error={errors.title} />
                    <FormTextArea label={this.tr("fld_desc")} onChange={this.onChange} name="content"
                        value={supportInfo.content} error={errors.content} placeholder={true} />
                    <div className="btn-group">
                        <button className="btn btn-primary" type="submit">{this.tr("submit")}</button>
                        <a className="btn btn-outline" href="tel:">
                            {this.tr("call_support")} <Icon name="call" />
                        </a>
                    </div>
                </FormWrapper>
            </div>
        );
    }

    private onChange = (key, value) => {
        this.state.supportInfo[key] = value;
        this.setState({ supportInfo: this.state.supportInfo });
    }

    private onSubmit = () => {
        const contactInfo = new SupportModel(this.state.supportInfo);
        contactInfo.phone = sanitizePhoneNumber(contactInfo.phone);
        const validationErrors = contactInfo.validate();
        if (validationErrors) {
            return this.setState({ validationErrors });
        }
        this.setState({ showLoader: true, validationErrors: null });
        this.api.post<ISupport>("contact", contactInfo.getValues())
            .then((response) => {
                this.setState({ showLoader: false });
                this.notif.success("msg_contact_us");
                this.props.history.push("/");
            })
            .catch((error) => {
                this.setState({ showLoader: false, validationErrors: error.violations });
                this.notif.error(error.message);
            });
    }
}
