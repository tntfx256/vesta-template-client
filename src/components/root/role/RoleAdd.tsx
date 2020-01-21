import { Button, IRouteComponentProps } from "@vesta/components";
import { Culture } from "@vesta/culture";
import React, { ComponentType } from "react";
import { RoleForm } from "./RoleForm";

interface IRoleAddParams {
}

interface IRoleAddProps extends IRouteComponentProps<IRoleAddParams> {
}

export const RoleAdd: ComponentType<IRoleAddProps> = (props: IRoleAddProps) => {

    const tr = Culture.getDictionary().translate;

    return (
        <div className="crud-page">
            <h2>{tr("title_record_add", tr("role"))}</h2>
            <RoleForm goBack={goBack}>
                <div className="btn-group">
                    <Button color="primary" variant="contained" type="submit">{tr("add")}</Button>
                    <Button color="primary" variant="outlined" type="button" onClick={goBack}>{tr("cancel")}</Button>
                </div>
            </RoleForm>
        </div>
    );

    function goBack() {
        props.history.goBack();
    }
};
