
import { Avatar, DateTimeInput, FormWrapper, IFormOption, Navbar, Preloader, Select, TextInput } from "@vesta/components";
import { IResponse, IValidationError } from "@vesta/core";
import { Culture } from "@vesta/culture";
import React, { ComponentType, useState } from "react";
import { RouteComponentProps } from "react-router";
import { withTheme } from "theming";
import { IRole } from "../../cmn/models/Role";
import { IUser, User, UserGender } from "../../cmn/models/User";
import { ApiService } from "../../service/ApiService";
import { AuthService } from "../../service/AuthService";
import { NotificationService } from "../../service/NotificationService";
import { getFileUrl, IModelValidationMessage, validationMessage } from "../../util/Util";

interface IProfileParams {
}

interface IProfileProps extends RouteComponentProps<IProfileParams> {
}

export const Profile: ComponentType<IProfileProps> = withTheme((props: IProfileProps) => {
    const tr = Culture.getDictionary().translate;
    const api = ApiService.getInstance();
    const auth = AuthService.getInstance();
    const notif = NotificationService.getInstance();
    const genderOptions: IFormOption[] = [
        { id: UserGender.Male, title: tr("enum_male") },
        { id: UserGender.Female, title: tr("enum_female") }];
    const formErrorsMessages: IModelValidationMessage = {
        birthDate: {
            timestamp: tr("err_date"),
        },
        email: {
            type: tr("err_email"),
        },
        firstName: {
            maxLength: tr("err_max_length", 64),
            minLength: tr("err_min_length", 2),
            required: tr("err_required"),
        },
        gender: {
            enum: tr("err_enum"),
        },
        image: {
            fileType: tr("err_file_type"),
            maxSize: tr("err_file_size", 6144),
        },
        lastName: {
            maxLength: tr("err_max_length", 64),
            minLength: tr("err_min_length", 2),
            required: tr("err_required"),
        },
        password: {
            conf: tr("not_equal"),
            minLength: tr("err_min_length", 4),
            required: tr("err_required"),
        },
    };
    // state
    const [preview, setPreview] = useState<string>("");
    const [user, setUser] = useState<IUser>(auth.getUser());
    const [validationErrors, setErrors] = useState<IValidationError>(null);
    user.role = (user.role as IRole).id;

    let userImage = null;
    if (user.image && "string" == typeof user.image) {
        userImage = getFileUrl(`user/${user.image}`);
    }
    const errors = validationErrors ? validationMessage(formErrorsMessages, validationErrors) : {};

    return (
        <div className="page profile-page has-navbar">
            <Navbar title={tr("profile")} backLink="/" />
            <FormWrapper onSubmit={onSubmit}>
                <div className="avatar-wrapper">
                    <Avatar src={preview ? preview : userImage as string}
                        defaultSrc="img/icons/144x144.png">
                        <button className="change-image" type="button">{tr("txt_change_image")}</button>
                        <input className="change-image" type="file" name="image" onChange={updateImage} />
                    </Avatar>
                    <h2>{user.username}</h2>
                    <p>{user.mobile}</p>
                </div>

                <fieldset className="profile-form">
                    <TextInput name="firstName" label={tr("fld_firstname")} value={user.firstName}
                        error={errors.firstName} onChange={onChange} />
                    <TextInput name="lastName" label={tr("fld_lastname")} value={user.lastName}
                        error={errors.lastName} onChange={onChange} />
                    <TextInput name="email" label={tr("fld_email")} value={user.email}
                        error={errors.email} onChange={onChange} type="email" dir="ltr" />
                    <Select name="gender" label={tr("fld_gender")} value={user.gender}
                        error={errors.gender} onChange={onChange} options={genderOptions} />
                    <DateTimeInput name="birthDate" label={tr("fld_birth_date")} value={user.birthDate}
                        error={errors.birthDate} onChange={onChange} />
                </fieldset>

                <fieldset className="profile-form">
                    <legend>{tr("txt_change_pass")}</legend>
                    <TextInput name="password" label={tr("fld_password")} value={user.password}
                        error={errors.password} onChange={onChange}
                        type="password" />
                    <TextInput name="confPassword" label={tr("fld_conf_password")}
                        value={(user as any).confPassword} onChange={onChange} type="password" />
                </fieldset>

                <div className="btn-group">
                    <button type="submit" className="btn btn-primary">{tr("update")}</button>
                </div>
            </FormWrapper>
        </div>
    );


    function onChange(name: string, value: any) {
        user[name] = value;
        setUser(user);
    }

    function onSubmit() {
        if (user.password && user.password != (user as any).confPassword) {
            return setErrors({ password: "conf" });
        }
        const userModel = new User(user);
        const validationErrors = userModel.validate();
        if (validationErrors) {
            if (!user.password) {
                delete validationErrors.password;
            }
            if (Object.keys(validationErrors).length) {
                return setErrors(validationErrors);
            }
        }
        let hasImage = false;
        const userImage: IUser = {};
        if (preview) {
            userImage.image = userModel.image;
            delete userModel.image;
            hasImage = true;
        }
        Preloader.show();
        setErrors(null);
        api.put<IUser>("user", userModel.getValues())
            .then((response) => {
                if (!hasImage) {
                    Preloader.hide();
                    return updateUser(response);
                }
                return api.upload<IUser>(`user/file/${userModel.id}`, userImage)
                    .then((uplResponse) => {
                        Preloader.hide();
                        updateUser(uplResponse);
                    });
            })
            .catch((error) => {
                Preloader.hide();
                setErrors(error.violations);
                notif.error(error.message);
            });
    }

    function updateImage(e) {
        const files = e.target.files;
        if (files.length) {
            const reader = new FileReader();
            const file = e.target.files[0];
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            onChange("image", files[0]);
        }
    }

    function updateUser(response: IResponse<IUser>) {
        const newUser = response.items[0];
        newUser.role = auth.getUser().role;
        auth.login(newUser);
        // removing user password from state
        delete user.password;
        delete (user as any).confPassword;
        setUser(newUser);
        notif.success("msg_profile_update");
    }
});
