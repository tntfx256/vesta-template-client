import { IRouteComponentProps } from "@vesta/components";
import { Culture } from "@vesta/culture";
import React, { ComponentType, useEffect, useState } from "react";
import { IUser } from "../../../cmn/models/User";
import { Crud } from "../../../service/Crud";
import { ILogger } from "../Log";

interface ILogDetailParams {
    id: number;
}

interface ILogDetailProps extends IRouteComponentProps<ILogDetailParams> {
    users: IUser[];
}

export const LogDetail: ComponentType<ILogDetailProps> = (props: ILogDetailProps) => {
    const service = Crud.getService<string>("log");

    let initiated = false;
    const [log, setLog] = useState("");

    useEffect(() => {
        if (initiated) { return; }
        initiated = true;
        this.service.fetch(+props.match.params.id).then((log) => setLog(log));
    });

    if (!log) { return null; }
    const records = [];
    const lines = log.split("\n");
    for (let i = 1, il = lines.length; i < il; ++i) {
        records.push(renderRecord(JSON.parse(lines[i]), i));
    }
    return (
        <div className="crud-page">
            {records}
        </div>
    );


    function renderRecord(log: ILogger, index: number) {
        const logLevelOptions = {
            0: this.tr("enum_none"),
            1: this.tr("enum_error"),
            2: this.tr("enum_warn"),
            3: this.tr("enum_info"),
        };
        const dateTime = Culture.getDateTimeInstance();
        const dateTimeFormat = Culture.getLocale().defaultDateTimeFormat;
        dateTime.setTime(log.start);
        const logDate = dateTime.format(dateTimeFormat);
        const sourceAppOptions = { 1: this.tr("enum_panel"), 2: this.tr("enum_enduser"), 3: this.tr("enum_service") };
        const logs = log.logs.map((thisLog, i) => {
            const messages = thisLog.message.split("-;-").map((msg, j) => (
                <li key={j} className={`alert alert-${thisLog.level}`}>{msg}</li>
            ));

            return (
                <li key={i} className="en">
                    <code>
                        {`@${thisLog.file || ""}::${thisLog.method || ""}`}
                        <ul>
                            {messages}
                        </ul>
                    </code>
                </li>
            );
        });

        return (
            <div className="details-table" key={index}>
                <p><label>{this.tr("fld_level")}</label> {logLevelOptions[log.level]}</p>
                <p><label>{this.tr("fld_date")}</label> <span className="en">{logDate}</span></p>
                <p><label>{this.tr("fld_sourceapp")}</label> {sourceAppOptions[log.sourceApp]}</p>
                <ul>
                    {logs}
                </ul>
            </div>
        );
    }
}
