// tslint:disable-next-line:max-line-length
import { CrudMenu, DataTable, IColumn, IQueryOption, IRouteComponentProps, Navbar, PageTitle, Preloader } from "@vesta/components";
import { Culture } from "@vesta/culture";
import React, { ComponentType, useEffect, useState } from "react";
import { Route, Switch } from "react-router";
import { HashRouter } from "react-router-dom";
import { ILog } from "../../cmn/models/Log";
import { IUser, SourceApp } from "../../cmn/models/User";
import { getAcl } from "../../service/Acl";
import { getCrud } from "../../service/crud";
import { Notif } from "../../service/Notif";
import { DataTableOperations } from "../general/DataTableOperations";
import { LogDetail } from "./log/LogDetail";

export interface ILogger {
    duration: number;
    level: number;
    logs: ILog[];
    sourceApp: SourceApp;
    start: number;
    user: number | IUser;
}

interface ILogParams {
}

interface ILogProps extends IRouteComponentProps<ILogParams> {
}

export const Log: ComponentType<ILogProps> = (props: ILogProps) => {
    const access = getAclInstance().getAccessList("log");
    const service = getCrudInstance<string>("log");
    const tr = Culture.getDictionary().translate;
    delete access[AclAction.Edit];

    const [logs, setLogs] = useState<ILog[]>([]);
    const [queryOption, setQueryOption] = useState<IQueryOption<string>>({});

    useEffect(() => {
        onFetchAll();
    }, []);

    const dateTime = Culture.getDateTimeInstance();
    const dateTimeFormat = Culture.getLocale().defaultDateTimeFormat;
    const columns: Array<IColumn<string>> = [
        { title: tr("fld_name"), render: (r) => <p className="en">{r}</p> },
        {
            render: (r) => {
                const timestamp = +(/^\d+/.exec(r)[0]);
                dateTime.setTime(timestamp);
                return <p className="en">{dateTime.format(dateTimeFormat)}</p>;
            },
            title: tr("fld_file"),
        },
        {
            render: (r) => {
                const timestamp = +(/^\d+/.exec(r)[0]);
                return <DataTableOperations access={access} id={timestamp} onDelete={onDelete} path="log" />;
            },
            title: tr("operations"),
        },
    ];

    return (
        <div className="page log-page has-navbar">
            <PageTitle title={tr("mdl_log")} />
            <Navbar title={tr("mdl_log")} onBurgerClick={openSidenav} />
            <h1>{tr("mdl_log")}</h1>
            <CrudMenu path="log" access={access} />
            <div className="crud-wrapper">
                <Go path="/log/detail/:id" component={LogDetail} />
                <div className="crud-page">
                    <DataTable columns={columns} records={logs as any} queryOption={queryOption} />
                </div>
            </div>
        </div>
    );

    function onFetchAll() {
        Preloader.show();
        // ModelService.getService("log").fetchAll
        service.fetchAll(queryOption)
            .then((items) => {
                Preloader.hide();
                setLogs(items as any);
            })
            .catch((error) => {
                Preloader.hide();
                Notif.getInstance().error(error.message);
            });
    }

    function onDelete(id) {
        Preloader.show();
        service.remove(id)
            .then((response) => {
                Preloader.hide();
                onFetchAll();
            })
            .catch((error) => {
                Preloader.hide();
            });
    }
};
