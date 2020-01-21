import { IRouteComponentProps, Button } from "@vesta/components";
import { Culture } from "@vesta/culture";
import React, { ComponentType } from "react";
import { UserForm } from "./UserForm";

interface IUserEditParams {
    id: number;
}

interface IUserEditProps extends IRouteComponentProps<IUserEditParams> {
}

export const UserEdit: ComponentType<IUserEditProps> = (props: IUserEditProps) => {

    const tr = Culture.getDictionary().translate;
    const id = +props.match.params.id;

    return (
        <div className="crud-page">
            <h2>{tr("title_record_edit", tr("mdl_user"))}</h2>
            <UserForm id={id} >
                <div className="btn-group">
                        <Button color="primary" variant="contained" type="submit">{tr("save")}</Button>
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
