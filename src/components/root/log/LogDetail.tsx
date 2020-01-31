import { IComponentProps } from "@vesta/components";
import { Culture } from "@vesta/culture";
import { ILog } from "@vesta/services";
import React, { ComponentType, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { ILogger } from "../../../cmn/interfaces/Logger";
import { IUser } from "../../../cmn/models/User";
import { getApiInstance } from "../../../service/Api";

interface ILogDetailParams {
  id: string;
}

interface ILogDetailProps extends IComponentProps, RouteComponentProps<ILogDetailParams> {
  users: IUser[];
}

export const LogDetail: ComponentType<ILogDetailProps> = (props: ILogDetailProps) => {
  const tr = Culture.getDictionary().translate;
  const [log, setLog] = useState("");

  useEffect(() => {
    getApiInstance()
      .get<ILog, string>(`log/${+props.match.params.id}`)
      .then(log => setLog(log));
  }, [props.match.params.id]);

  if (!log) {
    return null;
  }
  const records = [];
  const lines = log.split("\n");
  for (let i = 1, il = lines.length; i < il; ++i) {
    records.push(renderRecord(JSON.parse(lines[i]), i));
  }

  if (!records.length) {
    return (
      <div className="details-table">
        <h1>Log is empty</h1>
      </div>
    );
  }

  return <div className="crud-page">{records}</div>;

  function renderRecord(log: ILogger, index: number) {
    const logLevelOptions = {
      0: tr("enum_none"),
      1: tr("enum_error"),
      2: tr("enum_warn"),
      3: tr("enum_info"),
    };
    const dateTime = Culture.getDateTimeInstance();
    const dateTimeFormat = Culture.getLocale().defaultDateTimeFormat;
    dateTime.setTime(log.start);
    const logDate = dateTime.format(dateTimeFormat);
    // const sourceAppOptions = { 1: tr("enum_panel"), 2: tr("enum_enduser"), 3: tr("enum_service") };
    const logs = log.logs.map((thisLog, i) => {
      const messages = thisLog.message.split("-;-").map((msg, j) => (
        <li key={j} className={`alert alert-${thisLog.level}`}>
          {msg}
        </li>
      ));

      return (
        <li key={i} className="en">
          <code>
            {`@${thisLog.file || ""}::${thisLog.method || ""}`}
            <ul>{messages}</ul>
          </code>
        </li>
      );
    });

    return (
      <div className="details-table" key={index}>
        <p>
          <label>{tr("fld_level")}</label> {logLevelOptions[log.level]}
        </p>
        <p>
          <label>{tr("fld_date")}</label> <span className="en">{logDate}</span>
        </p>
        <ul>{logs}</ul>
      </div>
    );
  }
};
