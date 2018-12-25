import { DateTimeInput, FileInput, FormWrapper, IFormOption, Multichoice, Select, TextInput } from "@vesta/components";
import { IValidationError } from "@vesta/core";
import { Culture } from "@vesta/culture";
import React, { ComponentType, useEffect, useState } from "react";
import { Status } from "../../../cmn/enum/Status";
import { IRole } from "../../../cmn/models/Role";
import { IUser, User, UserGender, UserType } from "../../../cmn/models/User";
import { ModelService } from "../../../service/ModelService";
import { getFileUrl, validationMessage } from "../../../util/Util";
import { IBaseComponentProps } from "../../BaseComponent";

interface IUserFormProps extends IBaseComponentProps {
    id?: number;
}

export const UserForm: ComponentType<IUserFormProps> = (props: IUserFormProps) => {

    const tr = Culture.getDictionary().translate;
    const service = ModelService.getService<IUser>("user");
    const genderOptions: IFormOption[] = [
        { id: UserGender.Male, title: tr("enum_male") },
        { id: UserGender.Female, title: tr("enum_female") }];
    const statusOptions: IFormOption[] = [
        { id: Status.Active, title: tr("enum_active") },
        { id: Status.Inactive, title: tr("enum_inactive") }];
    const typeOptions: IFormOption[] = [
        { id: UserType.Admin, title: tr("enum_admin") },
        { id: UserType.User, title: tr("enum_user") }];
    const formErrorsMessages = {
        birthDate: {
            timestamp: tr("err_date"),
        },
        email: {
            email: tr("err_email"),
        },
        firstName: {
            maxLength: tr("err_max_length", 64),
            minLength: tr("err_min_length", 2),
            required: tr("err_required"),
        },
        gender: {
            enum: tr("err_enum"),
            required: tr("err_required"),
        },
        image: {
            fileType: tr("err_file_type"),
            maxSize: tr("err_file_size", 6144),
            required: tr("err_required"),
        },
        lastName: {
            maxLength: tr("err_max_length", 64),
            minLength: tr("err_min_length", 2),
            required: tr("err_required"),
        },
        mobile: {
            maxLength: tr("err_max_length", 12),
            minLength: tr("err_min_length", 9),
            required: tr("err_required"),
            type: tr("err_phone"),
        },
        password: {
            minLength: tr("err_min_length", 4),
            required: tr("err_required"),
        },
        role: {
            required: tr("err_required"),
        },
        status: {
            enum: tr("err_enum"),
            required: tr("err_required"),
        },
        type: {
            enum: tr("err_enum"),
            required: tr("err_required"),
        },
        username: {
            maxLength: tr("err_max_length", 16),
            minLength: tr("err_min_length", 4),
            required: tr("err_required"),
        },
    };

    const [user, setUser] = useState<IUser>({});
    const [roles, setRoles] = useState<IRole[]>([]);
    const [validationErrors, setValidationErrors] = useState<IValidationError>(null);

    useEffect(() => {
        const id = +props.id;
        if (isNaN(id)) { return; }
        service.fetch(id)
            .then((user) => {
                if (user.image) {
                    user.image = getFileUrl(`user/${user.image}`);
                }
                setUser(user);
            });
    })


    const errors = validationErrors ? validationMessage(formErrorsMessages, validationErrors) : {};
    const roleId = user.role && (user.role as IRole).id;

    return (
        <FormWrapper name="userForm" onSubmit={onSubmit}>
            <Multichoice name="type" label={tr("fld_type")} value={user.type}
                error={errors.type} onChange={onChange} options={typeOptions} />
            <Select name="role" label={tr("role")} options={roles} value={roleId}
                error={errors.role} onChange={onChange} titleKey="name" valueKey="id" />
            <TextInput name="username" label={tr("fld_username")} value={user.username}
                error={errors.username} onChange={onChange} />
            <TextInput name="firstName" label={tr("fld_firstname")} value={user.firstName}
                error={errors.firstName} onChange={onChange} />
            <TextInput name="lastName" label={tr("fld_lastname")} value={user.lastName}
                error={errors.lastName} onChange={onChange} />
            <TextInput name="email" label={tr("fld_email")} value={user.email}
                error={errors.email} onChange={onChange} type="email" />
            <TextInput name="mobile" label={tr("fld_mobile")} value={user.mobile}
                error={errors.mobile} onChange={onChange} />
            <TextInput name="password" label={tr("fld_password")} value={user.password}
                error={errors.password} onChange={onChange} type="password" />
            <DateTimeInput name="birthDate" label={tr("fld_birthDate")} value={user.birthDate}
                error={errors.birthDate} onChange={onChange} />
            <Select name="gender" label={tr("fld_gender")} value={user.gender}
                error={errors.gender} onChange={onChange} options={genderOptions} />
            <FileInput name="image" label={tr("fld_image")} value={user.image}
                error={errors.image} onChange={onChange} />
            <Select name="status" label={tr("fld_status")} value={user.status}
                error={errors.status} onChange={onChange} options={statusOptions} />
            {props.children}
        </FormWrapper>
    );

    function onChange(name: string, value: any) {
        user[name] = value;
        setUser(user);
    }

    function onSubmit() {
        const userModel = new User(user);
        const userFiles: IUser = {};
        const validationResult = userModel.validate();
        if (validationResult) {
            if (!userModel.password) {
                delete validationResult.password;
            }
            if (Object.keys(validationResult).length) {
                return Promise.reject(validationResult);
            }
        }
        let hasFile = false;
        if (userModel.image) {
            userFiles.image = userModel.image;
            delete userModel.image;
            hasFile = true;
        }
        service.save(userModel.getValues(), hasFile ? userFiles : null);
    }
}
