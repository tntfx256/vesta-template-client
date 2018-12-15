import React, { ChangeEvent, FC } from "react";
import { IBaseComponentProps } from "../../BaseComponent";
import { IFromControlProps } from "./FormWrapper";

export interface ITextInputProps extends IBaseComponentProps, IFromControlProps {
    dir?: "ltr" | "rtl";
    type?: string;
    value?: string;
}

export const TextInput: FC<ITextInputProps> = function (props: ITextInputProps) {

    const type = props.type || "text";
    const extClassName = props.dir ? `dir-${props.dir}` : "";

    return (
        <div className={`form-group text-input ${extClassName} ${props.error ? "has-error" : ""}`}>
            {props.placeholder ? null : <label htmlFor={props.name}>{props.label}</label>}
            <input className="form-control" type={type} name={name} id={name} placeholder={props.placeholder ? props.label : ""}
                value={props.value || ""} onChange={onChange} disabled={props.readonly} />
            <p className="form-error">{props.error || ""}</p>
        </div>
    );


    function onChange(e: ChangeEvent<HTMLInputElement>) {
        if (props.onChange && !props.readonly) {
            props.onChange(props.name, e.target.value);
        }
    }
}
