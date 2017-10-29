import React, {PureComponent} from "react";
import {BaseComponentProps} from "../../BaseComponent";
import {ChangeEventHandler, FormOption} from "./FormWrapper";

export interface FormMultichoiceProps extends BaseComponentProps {
    name: string;
    label: string;
    value?: Array<number | string>;
    onChange?: ChangeEventHandler;
    options: Array<FormOption>;
    error?: string;
}

export class FormMultichoice extends PureComponent<FormMultichoiceProps, null> {
    private list: HTMLUListElement;

    private onChange = (e) => {
        let value = [];
        let checkBoxes = this.list.querySelectorAll('input');
        for (let i = 0, il = checkBoxes.length; i < il; ++i) {
            if (checkBoxes[i].checked) {
                value.push(checkBoxes[i].value);
            }
        }
        this.props.onChange(this.props.name, value);
    }

    public render() {
        let {options, value, label, error} = this.props;
        let list: HTMLUListElement = null;
        let choices = options.map((o, i) => <li key={i}>
            <label>
                <input name={name} type="checkbox" value={o.value}
                       checked={value && value.indexOf(o.value) >= 0}
                       onChange={this.onChange}/> {o.title}
            </label>
        </li>);

        return (
            <div className={`form-group multichoice-input${error ? ' has-error' : ''}`}>
                <label>{label}</label>
                <p className="form-error">{error || ''}</p>
                <ul ref={el => list = el}>{choices}</ul>
            </div>
        )
    }
}