import React, { PureComponent } from "react";
import { Culture } from "../../../medium";
import { BaseComponentProps } from "../../BaseComponent";
import { DatePicker } from "../DatePicker";
import { Modal } from "../Modal";
import { ChangeEventHandler } from "./FormWrapper";

interface IFormDateTimeInputProps extends BaseComponentProps {
    error?: string;
    hasTime?: boolean;
    label: string;
    name: string;
    onChange?: ChangeEventHandler;
    placeholder?: boolean;
    value?: number;
}

interface IFormDateTimeInputState {
    showPicker?: boolean;
    value: string;
}

export class FormDateTimeInput extends PureComponent<IFormDateTimeInputProps, IFormDateTimeInputState> {
    private dateTime = Culture.getDateTimeInstance();
    private dateTimeFormat = this.props.hasTime ? Culture.getLocale().defaultDateTimeFormat : Culture.getLocale().defaultDateFormat;

    constructor(props: IFormDateTimeInputProps) {
        super(props);
        this.state = { value: this.format(), showPicker: false };
    }

    public render() {
        const { name, label, error, hasTime, placeholder } = this.props;
        const { value, showPicker } = this.state;

        const picker = showPicker ? (
            <Modal show={true} name="modal-zoom">
                <DatePicker value={value} onChange={this.onChange} onAbort={this.hidePicker} hasTime={hasTime} />
            </Modal>) : <Modal show={false} name="modal-zoom" />;

        return (
            <div className={`form-group date-time-input${error ? " has-error" : ""}`}>
                {placeholder ? null : <label htmlFor={name}>{label}</label>}
                <input className="form-control" name={name} id={name} placeholder={placeholder ? label : null} value={value} onChange={this.onInputChange} readOnly={true} onClick={this.showPicker} />
                <p className="form-error">{error || ""}</p>
                {picker}
            </div>
        );
    }

    private showPicker = () => {
        this.setState({ showPicker: true });
    }

    private hidePicker = () => {
        this.setState({ showPicker: false });
    }

    private format(): string {
        const { value } = this.props;
        const timestamp = +value;
        if (!isNaN(timestamp)) {
            this.dateTime.setTime(timestamp);
        }
        return this.dateTime.format(this.dateTimeFormat);
    }

    private onChange = (value) => {
        const { name, onChange, hasTime } = this.props;
        // dateTime validation, also sets the correct values
        if (this.dateTime.validate(value, hasTime)) {
            onChange(name, this.dateTime.getTime());
        }
        this.setState({ value, showPicker: false });
    }

    private onInputChange = (e) => {
        const value = e.target.value;
        this.onChange(value);
    }
}
