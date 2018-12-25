import { Culture } from "@vesta/culture";
import React, { ComponentType } from "react";
import { IBaseComponentWithRouteProps } from "../../BaseComponent";
import { RoleForm } from "./RoleForm";

interface IRoleAddParams {
}

interface IRoleAddProps extends IBaseComponentWithRouteProps<IRoleAddParams> {
}

export const RoleAdd: ComponentType<IRoleAddProps> = (props: IRoleAddProps) => {

    const tr = Culture.getDictionary().translate;

    return (
        <div className="crud-page">
            <h2>{tr("title_record_add", tr("role"))}</h2>
            <RoleForm goBack={goBack}>
                <div className="btn-group">
                    <button className="btn btn-primary" type="submit">{tr("save")}</button>
                    <button className="btn btn-outline" type="button"
                        onClick={goBack}>{tr("cancel")}</button>
                </div>
            </RoleForm>
        </div>
    );


    function goBack() {
        props.history.goBack();
    }
}
