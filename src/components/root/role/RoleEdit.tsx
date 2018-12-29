import { IRouteComponentProps } from "@vesta/components";
import { Culture } from "@vesta/culture";
import React, { ComponentType } from "react";
import { RoleForm } from "./RoleForm";

interface IRoleEditParams {
    id: number;
}

interface IRoleEditProps extends IRouteComponentProps<IRoleEditParams> {
}

export const RoleEdit: ComponentType<IRoleEditProps> = (props: IRoleEditProps) => {

    const tr = Culture.getDictionary().translate;
    const id = +props.match.params.id;

    return (
        <div className="crud-page">
            <h1>{tr("title_record_edit", tr("mdl_role"))}</h1>
            <RoleForm id={id} goBack={goBack}>
                <div className="btn-group">
                    <button className="btn btn-primary" type="submit">Save Role</button>
                    <button className="btn btn-outline" type="button"
                        onClick={goBack}>Cancel</button>
                </div>
            </RoleForm>
        </div>
    );

    function goBack() {
        props.history.goBack();
    }
}
