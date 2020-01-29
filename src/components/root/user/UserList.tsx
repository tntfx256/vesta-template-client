import { DataTable, IColumn, IComponentProps, IQueryOption } from "@vesta/components";
import { Culture } from "@vesta/culture";
import { IAccess } from "@vesta/services";
import React, { ComponentType, useEffect, useState } from "react";
import { IUser } from "../../../cmn/models/User";
import { getCrudInstance } from "../../../service/Crud";
import { DataTableOperations } from "../../general/DataTableOperations";

interface IUserListProps extends IComponentProps {
  access: IAccess;
}

export const UserList: ComponentType<IUserListProps> = (props: IUserListProps) => {
  const tr = Culture.getDictionary().translate;
  const userService = getCrudInstance<IUser>("user");

  const [users, setUsers] = useState([]);
  const [queryOption, setQueryOption] = useState({});

  useEffect(() => {
    fetchAll(queryOption);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statusOptions = { 1: tr("enum_active"), 0: tr("enum_inactive") };
  const columns: IColumn<IUser>[] = [
    { name: "id", title: tr("fld_id") },
    { name: "username", title: tr("fld_username") },
    { name: "name", title: tr("fld_name") },
    { name: "email", title: tr("fld_email") },
    { name: "mobile", title: tr("fld_mobile") },
    { name: "status", title: tr("fld_status"), render: r => tr(statusOptions[r.status]) },
    { render: r => <DataTableOperations id={r.id} path="user" access={props.access} onDelete={onDelete} /> },
  ];

  return (
    <div className="crud-page">
      <DataTable queryOption={queryOption} columns={columns} records={users} onPagination={fetchAll} pagination={true} />
    </div>
  );

  function onDelete(id: number) {
    userService.remove(id).then(isDeleted => (isDeleted ? fetchAll(null) : null));
  }

  function fetchAll(option: IQueryOption<IUser>) {
    if (!option) {
      option = queryOption;
    }
    setQueryOption(option);
    userService.fetchAll(option).then(setUsers);
  }
};
