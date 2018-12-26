import { DataTable, DataTableOperations, IColumn, IDataTableQueryOption } from "@vesta/components";
import React, { ComponentType, useState, useEffect } from "react";
import { IUser } from "../../../cmn/models/User";
import { IAccess, AuthService } from "../../../service/getAuth";
import { Crud } from "../../../service/Crud";
import { IBaseComponentProps } from "../../BaseComponent";
import { Culture } from "@vesta/culture";

interface IUserListProps extends IBaseComponentProps {
    access: IAccess;
}

interface IUserListState {
    queryOption: IDataTableQueryOption<IUser>;
    users: IUser[];
}

export const UserList: ComponentType<IUserListProps> = (props: IUserListProps) => {

    const access = AuthService.getInstance().getAccessList("user");
    const tr = Culture.getDictionary().translate;
    const userService = Crud.getService<IUser>("user");
    let initiated = false;

    const [users, setUsers] = useState([]);
    const [queryOption, setQueryOption] = useState({});

    useEffect(() => {
        if (initiated) { return; }
        initiated = true;
        onFetch(null);
    });

    const statusOptions = { 1: tr("enum_active"), 0: tr("enum_inactive") };
    // prevent deleting user
    delete access.del;
    const columns: Array<IColumn<IUser>> = [
        { name: "id", title: tr("fld_id") },
        { name: "username", title: tr("fld_username") },
        { name: "name", title: tr("fld_name") },
        { name: "email", title: tr("fld_email") },
        { name: "mobile", title: tr("fld_mobile") },
        { name: "status", title: tr("fld_status"), render: (r) => tr(statusOptions[r.status]) },
        {
            render: (r) => <DataTableOperations id={r.id} path="user" access={access} onDelete={onDelete} />,
            title: tr("operations"),
        },
    ];
    return (
        <div className="crud-page">
            <DataTable queryOption={queryOption} columns={columns} records={users}
                onChange={onFetch} pagination={true} />
        </div>
    );

    function onDelete(id: number) {
        userService.remove(id)
            .then((isDeleted) => isDeleted ? onFetch(null) : null);
    }

    function onFetch(option: IDataTableQueryOption<IUser>) {
        if (!option) {
            option = queryOption;
        }
        setQueryOption(option);
        userService.fetchAll(option).then(setUsers);
    }
}
