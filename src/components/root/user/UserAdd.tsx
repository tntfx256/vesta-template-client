import { IComponentProps } from "@vesta/components";
import { Culture } from "@vesta/culture";
import React, { ComponentType } from "react";
import { RouteComponentProps } from "react-router";
import { UserForm } from "./UserForm";

interface IUserAddParams {
}

interface IUserAddProps extends IComponentProps, RouteComponentProps<IUserAddParams> {
}

export const UserAdd: ComponentType<IUserAddProps> = (props: IUserAddProps) => {

    const tr = Culture.getDictionary().translate;

    return (
        <div className="crud-page">
            <h2>{tr("title_record_add", tr("mdl_user"))}</h2>
            <UserForm>
                <div className="btn-group">
                    <button className="btn btn-primary" type="submit">{tr("add")}</button>
                    <button className="btn btn-outline" type="button"
                        onClick={goBack}>{tr("cancel")}</button>
                </div>
            </UserForm>
        </div>
    );

    function goBack() {
        props.history.goBack();
    }
};
