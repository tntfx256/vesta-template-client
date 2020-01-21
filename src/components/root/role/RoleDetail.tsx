import { IRouteComponentProps } from "@vesta/components";
import { Culture } from "@vesta/culture";
import { IPermissions } from "@vesta/services";
import React, { ComponentType, useEffect, useState } from "react";
import { IPermission } from "../../../cmn/models/Permission";
import { IRole } from "../../../cmn/models/Role";
import { getCrud } from "../../../service/Crud";

interface IRoleDetailParams {
    id: number;
}

interface IRoleDetailProps extends IRouteComponentProps<IRoleDetailParams> {
}

export const RoleDetail: ComponentType<IRoleDetailProps> = (props: IRoleDetailProps) => {
    const service = getCrud<IRole>("acl/role");
    const tr = Culture.getDictionary().translate;

    const [role, setRole] = useState<IRole>(null);

    useEffect(() => {
        service.fetch(+props.match.params.id).then(setRole);
    }, [props.match.params.id]);

    if (!role) { return null; }
    const permissions: IPermissions = {};
    for (let i = 0, il = role.permissions.length; i < il; ++i) {
        const p: IPermission = role.permissions[i] as IPermission;
        if (!permissions[p.resource]) {
            permissions[p.resource] = [];
        }
        permissions[p.resource].push(p.action);
    }
    const permissionElements = [];
    for (let resources = Object.keys(permissions), i = 0, il = resources.length; i < il; ++i) {
        permissionElements.push(
            <tr key={i}>
                <td>{resources[i]}</td>
                <td>{permissions[resources[i]].join(", ")}</td>
            </tr>);
    }
    const statusOptions = { 1: tr("enum_active"), 0: tr("enum_inactive") };
    return (
        <div className="crud-page">
            <table className="details-table">
                <thead>
                    <tr>
                        <th colSpan={2}>{tr("mdl_role")} #{role.id}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{tr("fld_name")}</td>
                        <td>{role.name}</td>
                    </tr>
                    <tr>
                        <td>{tr("fld_desc")}</td>
                        <td>{role.desc}</td>
                    </tr>
                    <tr>
                        <td>{tr("fld_status")}</td>
                        <td>{statusOptions[role.status]}</td>
                    </tr>
                    <tr>
                        <td>{tr("fld_permission")}</td>
                        <td>
                            <table>
                                <thead>
                                    <tr>
                                        <th>{tr("fld_resource")}</th>
                                        <th>{tr("fld_action")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {permissionElements}
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};
