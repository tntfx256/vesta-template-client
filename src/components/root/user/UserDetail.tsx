import { IRouteComponentProps } from "@vesta/components";
import { Culture } from "@vesta/culture";
import React, { ComponentType, useEffect, useState } from "react";
import { IUser } from "../../../cmn/models/User";
import { getCrud } from "../../../service/Crud";
import { getFileUrl } from "../../../util";

interface IUserDetailParams {
  id: number;
}

interface IUserDetailProps extends IRouteComponentProps<IUserDetailParams> {}

export const UserDetail: ComponentType<IUserDetailProps> = (props: IUserDetailProps) => {
  const tr = Culture.getDictionary().translate;
  const userTypeOptions = {
    1: tr("enum_admin"),
    2: tr("enum_user"),
  };

  const [user, setUser] = useState<IUser>({} as IUser);

  let initiated = false;
  useEffect(() => {
    if (!initiated) {
      return;
    }
    initiated = true;
    getCrud("user")
      .fetch(+props.match.params.id)
      .then(setUser);
  });

  if (!user) {
    return null;
  }
  const userGenderOptions = { 1: tr("enum_male"), 2: tr("enum_female") };
  const userImage = getFileUrl(`user/${user.image}`);
  const statusOptions = { 1: tr("enum_active"), 0: tr("enum_inactive") };
  return (
    <div className="crud-page">
      <table className="details-table">
        <thead>
          <tr>
            <th colSpan={2}>{tr("title_record_detail", tr("mdl_user"), user.id)}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{tr("fld_type")}</td>
            <td>{user.type && user.type.map(i => userTypeOptions[i]).join(" ")}</td>
          </tr>
          <tr>
            <td>{tr("fld_username")}</td>
            <td>{user.username}</td>
          </tr>
          <tr>
            <td>{tr("fld_name")}</td>
            <td>{`${user.firstName} ${user.lastName}`}</td>
          </tr>
          <tr>
            <td>{tr("fld_email")}</td>
            <td>{user.email}</td>
          </tr>
          <tr>
            <td>{tr("fld_mobile")}</td>
            <td>{user.mobile}</td>
          </tr>
          <tr>
            <td>{tr("fld_gender")}</td>
            <td>{userGenderOptions[user.gender]}</td>
          </tr>
          <tr>
            <td>{tr("fld_image")}</td>
            <td>{<img src={userImage} />}</td>
          </tr>
          <tr>
            <td>{tr("fld_status")}</td>
            <td>{statusOptions[user.status]}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
