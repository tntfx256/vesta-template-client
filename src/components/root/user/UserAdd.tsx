import { IRouteComponentProps } from "@vesta/components";
import { Culture } from "@vesta/culture";
import React, { ComponentType } from "react";
import { UserForm } from "./UserForm";

interface IUserAddParams {
}

interface IUserAddProps extends IRouteComponentProps<IUserAddParams> {
}

export const UserAdd: ComponentType<IUserAddProps> = (props: IUserAddProps) => {

    const tr = Culture.getDictionary().translate;

    return (
        <div className="crud-page">
            <h2>{tr("title_record_add", tr("mdl_user"))}</h2>
            <UserForm>
                <div className="btn-group">
                        <Button color="primary" variant="contained" type="submit">{tr("add")}</Button>
                        <Button color="primary" variant="outlined" type="button" onClick={goBack}>
                            {tr("cancel")}
                        </Button>
                </div>
            </UserForm>
        </div>
    );

    function goBack() {
        props.history.goBack();
    }
};
