import { cmnConfig, ICmnConfig } from "../cmn/config";
import { SourceApp } from "../cmn/enum/SourceApp";

export interface IPaginationConfig {
  itemsPerPage: number;
}

export interface ITransitionConfig {
  enter: number;
  leave: number;
}

export interface IAppConfig extends ICmnConfig {
  env: string,
  api: string;
  sourceApp: SourceApp;
  pagination: IPaginationConfig;
  transition: ITransitionConfig;
  viewport: {
    Large: number;
    Medium: number;
    Small: number;
  }
}

export const config: IAppConfig = {
  env: process.env.NODE_ENV || "development",
  api: process.env.REACT_APP_API_ENDPOINT || "http://localhost:3000",
  locale: cmnConfig.locale,
  name: cmnConfig.name,
  sourceApp: SourceApp.Panel,
  pagination: {
    itemsPerPage: 20,
  },
  transition: {
    enter: 150,
    leave: 100,
  },
  version: cmnConfig.version,
  viewport: {
    Large: 1024,
    Medium: 768,
    Small: 425,
  }
};
