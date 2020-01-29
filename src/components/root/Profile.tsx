import { Avatar, Button, DateTimeInput, FormWrapper, IFormOption, Navbar, Preloader, Select, TextInput } from "@vesta/components";
import { IModelValidationMessage, IResponse, IValidationError, validationMessage } from "@vesta/core";
import { Culture } from "@vesta/culture";
import React, { ComponentType, useState, useContext } from "react";
import { RouteComponentProps } from "react-router";
import { IRole } from "../../cmn/models/Role";
import { IUser, User, UserGender } from "../../cmn/models/User";
import { getAccountInstance } from "../../service/Account";
import { getApiInstance } from "../../service/Api";
import { Notif } from "../../service/Notif";
import { getFileUrl } from "../../util";
import { Store } from "../../service/Store";

// tslint:disable-next-line: no-empty-interface
interface IProfileParams {}

interface IProfileProps extends RouteComponentProps<IProfileParams> {}

export const Profile: ComponentType<IProfileProps> = (props: IProfileProps) => {
  const tr = Culture.getDictionary().translate;
  const auth = getAccountInstance();
  const api = getApiInstance();
  const notif = Notif.getInstance();
  const { dispatch } = useContext(Store);
  const genderOptions: IFormOption[] = [
    { id: UserGender.Male, title: tr("enum_male") },
    { id: UserGender.Female, title: tr("enum_female") },
  ];
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

  let userImage = null;
  if (user.image && "string" === typeof user.image) {
    userImage = getFileUrl(`user/${user.image}`);
  }
  const errors = validationErrors ? validationMessage(formErrorsMessages, validationErrors) : {};

  return (
    <div className="page profile-page has-navbar">
      <Navbar title={tr("profile")} onBack={() => props.history.replace("/")} />
      <FormWrapper onSubmit={onSubmit}>
        <div className="avatar-wrapper">
          <Avatar src={preview ? preview : (userImage as string)} defaultSrc="img/icons/144x144.png">
            <button className="change-image" type="button">
              {tr("txt_change_image")}
            </button>
            <input className="change-image" type="file" name="image" onChange={updateImage} />
          </Avatar>
          <h2>{user.username}</h2>
          <p>{user.mobile}</p>
        </div>

        <fieldset className="profile-form">
          <TextInput name="firstName" label={tr("fld_firstname")} value={user.firstName} error={errors.firstName} onChange={onChange} />
          <TextInput name="lastName" label={tr("fld_lastname")} value={user.lastName} error={errors.lastName} onChange={onChange} />
          <TextInput name="email" label={tr("fld_email")} value={user.email} error={errors.email} onChange={onChange} type="email" dir="ltr" />
          <Select name="gender" label={tr("fld_gender")} value={user.gender} error={errors.gender} onChange={onChange} options={genderOptions} />
          <DateTimeInput name="birthDate" label={tr("fld_birth_date")} value={user.birthDate} error={errors.birthDate} onChange={onChange} />
        </fieldset>

        <fieldset className="profile-form">
          <legend>{tr("txt_change_pass")}</legend>
          <TextInput name="password" label={tr("fld_password")} value={user.password} error={errors.password} onChange={onChange} type="password" />
          <TextInput name="confPassword" label={tr("fld_conf_password")} value={(user as any).confPassword} onChange={onChange} type="password" />
        </fieldset>

        <div className="btn-group">
          <Button type="submit" variant="contained" color="primary">
            {tr("update")}
          </Button>
        </div>
      </FormWrapper>
    </div>
  );

  function onChange(name: string, value: any) {
    setUser({ ...user, [name]: value });
  }

  function onSubmit() {
    if (user.password && user.password !== (user as any).confPassword) {
      return setErrors({ password: "conf" });
    }
    const userModel = new User(user);
    userModel.role = (user.role as IRole).id;
    const validationErrors = userModel.validate();
    if (validationErrors) {
      delete validationErrors.role;
      if (!user.password) {
        delete validationErrors.password;
      }
      if (Object.keys(validationErrors).length) {
        return setErrors(validationErrors);
      }
    }
    let hasImage = false;
    const userFiles: IUser = {};
    if (preview) {
      userFiles.image = userModel.image;
      delete userModel.image;
      hasImage = true;
    }
    Preloader.show();
    setErrors(null);
    api
      .put<IUser, IResponse<IUser>>("user", userModel.getValues())
      .then(response => {
        if (!hasImage) {
          Preloader.hide();
          return updateUser(response);
        }
        return api.upload<IUser, IResponse<IUser>>(`user/file/${userModel.id}`, userFiles).then(uplResponse => {
          Preloader.hide();
          updateUser(uplResponse);
        });
      })
      .catch(error => {
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
    // removing user password from state
    delete user.password;
    delete (user as any).confPassword;
    setUser(newUser);
    dispatch({ user: newUser });
    notif.success("msg_profile_update");
  }
};
