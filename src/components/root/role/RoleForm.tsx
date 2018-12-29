import { FormWrapper, IComponentProps, IFormOption, Multichoice, Select, TextInput } from "@vesta/components";
import { IValidationError, validationMessage } from "@vesta/core";
import { Culture } from "@vesta/culture";
import React, { ComponentType, useEffect, useState } from "react";
import { Status } from "../../../cmn/enum/Status";
import { IPermission } from "../../../cmn/models/Permission";
import { IRole, Role } from "../../../cmn/models/Role";
import { Crud } from "../../../service/Crud";
import { IAction } from "../Role";

interface IPermissionCollection {
    [name: string]: IPermission[];
}

interface IRoleFormProps extends IComponentProps {
    id?: number;
    goBack: () => void;
}

export const RoleForm: ComponentType<IRoleFormProps> = (props: IRoleFormProps) => {
    const tr = Culture.getDictionary().translate;
    const roleService = Crud.getService<IRole>("acl/role");
    const permissionService = Crud.getService<IPermission>("acl/permission");
    let initiated = false;
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

    const [role, setRole] = useState<IRole>({ permissions: [] });
    const [permissions, setPermissions] = useState<IPermissionCollection>({});
    const [validationErrors, setValidationErrors] = useState<IValidationError>(null);

    useEffect(() => {
        if (initiated) { return; }
        let permissions = [];
        permissionService.fetchAll({})
            .then((items) => {
                permissions = items;
                const id = +props.id;
                if (isNaN(id)) { return null; }
                return roleService.fetch(id);
            })
            .then((role) => parsePermissions(permissions, role));
    })

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
                    <ul className="permission-list">
                        {rows}
                    </ul>
                </div>
                {props.children}
            </div>
        </FormWrapper>
    );


    function getAllPermissionsValue() {
        let values = [];
        const names = Object.keys(permissions);
        for (let i = names.length; i--;) {
            values = values.concat(permissions[names[i]]);
        }
        return values;
    }

    function onChange(name: string, value: any) {
        role[name] = value;
        setRole(role);
    }

    function onPermissionChange(name: string, value: any) {
        if (!value) {
            delete permissions[name];
        } else {
            permissions[name] = value;
        }
        role.permissions = getAllPermissionsValue();
        setRole(role);
    }

    function onSubmit() {
        roleService.submit(new Role(role))
            .then(props.goBack)
            .catch((error) => setValidationErrors(error.violations));
    }

    function parsePermissions(inpPermissions: IPermission[], inpRole: IRole) {
        inpRole = inpRole || role;
        // converting list of [{resource, action}] => {resource=> [actions]}
        for (let i = 0, il = inpPermissions.length; i < il; ++i) {
            const p: IPermission = inpPermissions[i] as IPermission;
            if (!permissions[p.resource]) {
                permissions[p.resource] = [];
            }
            permissions[p.resource].push({ id: p.id, action: p.action } as IPermission);
        }
        const resources = Object.keys(permissions);
        for (let i = resources.length; i--;) {
            const resource = resources[i];
            const actions = permissions[resource].map((a: IAction) => a.id);
            const rolePermissions = inpRole.permissions.map((p: IPermission) => p.id);
            for (let j = rolePermissions.length; j--;) {
                if (actions.indexOf(rolePermissions[j]) >= 0) {
                    if (!permissions[resource]) {
                        permissions[resource] = [];
                    }
                    permissions[resource].push(rolePermissions[j] as IPermission);
                }
            }
        }

        setRole(inpRole);
        setPermissions(permissions);
    }

    function renderPermissionTable() {
        const resources = Object.keys(permissions);
        if (!resources.length) { return null; }
        const rows = [];
        for (let i = resources.length; i--;) {
            const resource = resources[i];
            const actions = permissions[resource];
            const values = permissions[resource];
            rows.push(
                <li key={i}>
                    <Multichoice name={resource} label={resource} value={values} onChange={onPermissionChange}
                        options={actions} titleKey="action" />
                </li>);
        }
        return rows;
    }
}
