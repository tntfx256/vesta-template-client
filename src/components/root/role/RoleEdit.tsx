import { Button, IRouteComponentProps } from "@vesta/components";
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
                    <Button color="primary" variant="contained" type="submit">{tr("save")}</Button>
                    <Button color="primary" variant="outlined" type="button" onClick={goBack}>{tr("cancel")}</Button>
                </div>
            </RoleForm>
        </div>
    );

    function goBack() {
        props.history.goBack();
    }
};
