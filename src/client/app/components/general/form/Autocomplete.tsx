import React, {Component} from "react";
import {BaseComponentProps} from "../../BaseComponent";
import {ChangeEventHandler} from "./FormWrapper";

export interface AutocompleteProps<T> extends BaseComponentProps {
    label: string;
    name: string;
    value?: any;
    onChange?: ChangeEventHandler;
    error?: string;
    collection?: Array<T>;
    titleKey: string;
    valueKey: string;
}

export interface AutocompleteState<T> {
}

export class Autocomplete<T> extends Component<AutocompleteProps<T>, AutocompleteState<T>> {

    constructor(props: AutocompleteProps<T>) {
        super(props);
        this.state = {};
    }

    private onItemSelect = (e) => {
        let {titleKey, valueKey} = this.props;
        this.props.onChange(this.props.name, {
            [titleKey]: e.target.textContent,
            [valueKey]: e.target.getAttribute('data-value')
        });
    }

    private renderList() {
        let {titleKey, valueKey} = this.props;
        return this.props.collection.map((item, index) => (
            <a className="list-item" onClick={this.onItemSelect} key={index}
               data-value={item[valueKey]}>{item[titleKey]}</a>
        ));
    }

    private onChange = (e) => {
        let {titleKey, valueKey} = this.props;
        this.props.onChange(this.props.name, {
            [valueKey]: 0,
            [titleKey]: e.target.value
        });
    }

    public render() {
        let {name, label, error} = this.props;
        let list = this.renderList();
        return (
            <div className={`form-group autocomplete-input${error ? ' has-error' : ''}`}>
                <label htmlFor={name}>{label}</label>
                <input className="form-control" onChange={this.onChange} value={this.props.value[this.props.titleKey]}/>
                <div className="list-wrapper form-control">
                    {list}
                </div>
                <p className="form-error">{error || ''}</p>
            </div>
        )
    }
}