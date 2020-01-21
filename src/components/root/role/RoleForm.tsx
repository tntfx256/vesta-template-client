import { FormWrapper, IComponentProps, IFormOption, Multichoice, Select, TextInput } from "@vesta/components";
import { IValidationError, validationMessage } from "@vesta/core";
import { Culture } from "@vesta/culture";
import React, { ComponentType, useEffect, useState } from "react";
import { Status } from "../../../cmn/enum/Status";
import { IPermission } from "../../../cmn/models/Permission";
import { IRole, Role } from "../../../cmn/models/Role";
import { getCrud } from "../../../service/Crud";

interface IPermissionCollection {
    [name: string]: IPermission[];
}

interface IRoleFormProps extends IComponentProps {
    id?: number;
    goBack: () => void;
}

export const RoleForm: ComponentType<IRoleFormProps> = (props: IRoleFormProps) => {
    const tr = Culture.getDictionary().translate;
    const roleService = getCrud<IRole>("acl/role");
    const statusOptions: IFormOption[] = [
        { id: Status.Active, title: tr("enum_active") },
        { id: Status.Inactive, title: tr("enum_inactive") }];
    const formErrorsMessages = {
        name: {
            required: tr("err_required"),
        },
        status: {
            enum: tr("err_enum"),
            required: tr("err_required"),
        },
    };

    const [role, setRole] = useState<IRole>({ permissions: [] } as IRole);
    const [permissions, setPermissions] = useState<IPermissionCollection>({});
    const [validationErrors, setValidationErrors] = useState<IValidationError>(null);

    useEffect(() => {
        let rawPermissions = [];
        getCrud<IPermission>("acl/permission").fetchAll({})
            .then((items) => {
                rawPermissions = items;
                const id = +props.id;
                if (!id || isNaN(id)) { return null; }
                return roleService.fetch(id);
            })
            .then((rawRole) => parsePermissions(rawPermissions, rawRole));
    }, [props.id]);

    const errors = validationErrors ? validationMessage(formErrorsMessages, validationErrors) : {};
    const rows = renderPermissionTable();

    return (
        <FormWrapper name="roleAddForm" onSubmit={onSubmit}>
            <div className="roleForm-component">
                <TextInput name="name" label={tr("fld_name")} value={role.name}
                    error={errors.name} onChange={onChange} />
                <TextInput name="desc" label={tr("fld_desc")} value={role.desc}
                    error={errors.desc} onChange={onChange} />
                <Select name="status" label={tr("fld_status")} value={role.status}
                    titleKey="title" error={errors.status} onChange={onChange}
                    options={statusOptions} />
                <div className="form-group">
                    <label>{tr("fld_permission")}</label>
                    <ul className="permission-list">
                        {rows}
                    </ul>
                </div>
                {props.children}
            </div>
        </FormWrapper>
    );

    function getValuesForResource(resource: string): number[] {
        const values = [];
        // selecting a subset of IDs from role.permissions
        for (const p of permissions[resource]) {
            if (role.permissions.indexOf(p.id) >= 0) {
                values.push(p.id);
            }
        }
        return values;
    }

    function onChange(name: string, value: any) {
        role[name] = value;
        setRole({ ...role });
    }

    function onPermissionChange(name: string, values: number[]) {
        // deleting all IDs of named permission
        for (const p of permissions[name]) {
            const index = role.permissions.indexOf(p.id);
            if (index >= 0) {
                role.permissions.splice(index, 1);
            }
        }
        role.permissions = role.permissions.concat(values || []);
        setRole(role);
    }

    function onSubmit() {
        roleService.submit(new Role(role))
            .then(props.goBack)
            .catch((error) => setValidationErrors(error.violations));
    }

    function parsePermissions(rawPermissions: IPermission[], rawRole: IRole) {
        rawRole = rawRole || role;
        // converting list of [{resource, action}] => {resource=> [actions]}
        for (let i = 0, il = rawPermissions.length; i < il; ++i) {
            const p: IPermission = rawPermissions[i] as IPermission;
            if (!permissions[p.resource]) {
                permissions[p.resource] = [];
            }
            permissions[p.resource].push({ id: p.id, action: p.action } as IPermission);
        }
        // converting role.permissions of type IPermission[] to number[]
        const values = [];
        for (const p of rawRole.permissions) {
            values.push((p as IPermission).id);
        }
        rawRole.permissions = values;
        setRole(rawRole);
        setPermissions(permissions);
    }

    function renderPermissionTable() {
        const resources = Object.keys(permissions);
        if (!resources.length) { return null; }
        const list = [];
        for (let i = resources.length; i--;) {
            const resource = resources[i];
            const actions = permissions[resource];
            const values = getValuesForResource(resource);
            list.push(
                <li key={i}>
                    <Multichoice name={resource} label={resource} value={values} onChange={onPermissionChange}
                        options={actions} titleKey="action" />
                </li>);
        }
        return list;
    }
};

// RoleForm.defaultProps = {
//     id: 0,
// };
