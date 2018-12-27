import { DataTable, DataTableOperations, IColumn, IDataTableQueryOption } from "@vesta/components";
import { Culture } from "@vesta/culture";
import { IAccess } from "@vesta/services";
import React, { ComponentType, useEffect, useState } from "react";
import { IRole } from "../../../cmn/models/Role";
import { Crud } from "../../../service/Crud";
import { Notif } from "../../../service/Notif";
import { IBaseComponentProps } from "../../BaseComponent";

interface IRoleListProps extends IBaseComponentProps {
    access: IAccess;
}

export const RoleList: ComponentType<IRoleListProps> = (props: IRoleListProps) => {
    const service = Crud.getService<IRole>("acl/role");
    const tr = Culture.getDictionary().translate;
    let initialized = false;

    const [queryOption, setQueryOption] = useState<IDataTableQueryOption<IRole>>({});
    const [roles, setRoles] = useState<IRole[]>([]);


    useEffect(() => {
        if (initialized) { return; }
        initialized = true;
        fetchAll(queryOption);
    })

    const statusOptions = { 1: tr("enum_active"), 0: tr("enum_inactive") };
    const columns: Array<IColumn<IRole>> = [
        { name: "id", title: tr("fld_id") },
        { name: "name", title: tr("fld_name") },
        { name: "status", title: tr("fld_status"), render: (r) => tr(statusOptions[r.status]) },
        {
            render: (r) => <DataTableOperations id={r.id} access={props.access} onDelete={onDelete} path="role" />,
            title: tr("operations"),
        },
    ];
    return (
        <div className="crud-page">
            <DataTable onChange={fetchAll} columns={columns} records={roles} pagination={false}
                queryOption={queryOption} />
        </div>);


    function fetchAll(queryOption: IDataTableQueryOption<IRole>) {
        service.fetchAll(queryOption)
            .then((roles) => {
                setRoles(roles);
                setQueryOption(queryOption);
            });
    }

    function onDelete(id) {
        service.remove(id)
            .then((response) => {
                Notif.getInstance().success(tr("info_delete_record"));
                fetchAll(queryOption);
            })
            .catch((error) => {
                Notif.getInstance().error(tr(error.message));
            });
    }
}
