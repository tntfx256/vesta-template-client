import { DataTable, IColumn, IComponentProps, IQueryOption } from "@vesta/components";
import { Culture } from "@vesta/culture";
import { IAccess } from "@vesta/services";
import React, { ComponentType, useEffect, useState } from "react";
import { IRole } from "../../../cmn/models/Role";
import { getCrudInstance } from "../../../service/Crud";
import { Notif } from "../../../service/Notif";
import { DataTableOperations } from "../../general/DataTableOperations";

interface IRoleListProps extends IComponentProps {
  access: IAccess;
}

export const RoleList: ComponentType<IRoleListProps> = (props: IRoleListProps) => {
  const service = getCrudInstance<IRole>("acl/role");
  const tr = Culture.getDictionary().translate;

  const [roles, setRoles] = useState<IRole[]>([]);
  const [queryOption, setQueryOption] = useState<IQueryOption<IRole>>({});

  useEffect(() => {
    fetchAll(queryOption);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statusOptions = { 1: tr("enum_active"), 0: tr("enum_inactive") };
  const columns: IColumn<IRole>[] = [
    { name: "id", title: tr("fld_id") },
    { name: "name", title: tr("fld_name") },
    { name: "status", title: tr("fld_status"), render: r => tr(statusOptions[r.status]) },
    {
      render: r => <DataTableOperations id={r.id} access={props.access} onDelete={onDelete} path="role" />,
      title: tr("operations"),
    },
  ];
  return (
    <div className="crud-page">
      <DataTable onPagination={fetchAll} columns={columns} records={roles} pagination={false} queryOption={queryOption} />
    </div>
  );

  function fetchAll(option: IQueryOption<IRole>) {
    service.fetchAll(option).then(roles => {
      setRoles(roles);
      setQueryOption({ ...option });
    });
  }

  function onDelete(id) {
    service
      .remove(id)
      .then(response => {
        Notif.getInstance().success(tr("info_delete_record"));
        fetchAll(queryOption);
      })
      .catch(error => {
        Notif.getInstance().error(tr(error.message));
      });
  }
};
