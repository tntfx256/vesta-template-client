import { DataTable, DataTableOperations, IColumn, IDataTableQueryOption } from "@vesta/components";
import { Culture } from "@vesta/culture";
import React, { ComponentType, useEffect, useState } from "react";
import { IRole } from "../../../cmn/models/Role";
import { AuthService, IAccess } from "../../../service/AuthService";
import { ModelService } from "../../../service/ModelService";
import { NotificationService } from "../../../service/NotificationService";
import { IBaseComponentProps } from "../../BaseComponent";

interface IRoleListProps extends IBaseComponentProps {
    access: IAccess;
}

export const RoleList: ComponentType<IRoleListProps> = (props: IRoleListProps) => {
    const access = AuthService.getInstance().getAccessList("role");
    const service = ModelService.getService<IRole>("acl/role");
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
            render: (r) => <DataTableOperations id={r.id} access={access} onDelete={onDelete} path="role" />,
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
                NotificationService.getInstance().success(tr("info_delete_record"));
                fetchAll(queryOption);
            })
            .catch((error) => {
                NotificationService.getInstance().error(tr(error.message));
            });
    }
}
