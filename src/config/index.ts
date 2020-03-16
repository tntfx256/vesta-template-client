import { cmnConfig, ICmnConfig } from "../cmn/config";
import { SourceApp } from "../cmn/enum/SourceApp";
import { IVariantConfig, variantConfig } from "./variantConfig";

export interface IPaginationConfig {
  itemsPerPage: number;
}

export interface ITransitionConfig {
  enter: number;
  leave: number;
}

export interface IAppConfig extends IVariantConfig, ICmnConfig {
  sourceApp: SourceApp;
  pagination: IPaginationConfig;
  transition: ITransitionConfig;
}

export const config: IAppConfig = {
  api: variantConfig.api,
  env: variantConfig.env,
  locale: cmnConfig.locale,
  name: cmnConfig.name,
  sourceApp: SourceApp.Panel,
  pagination: {
    itemsPerPage: 20,
  },
  sw: variantConfig.sw,
  transition: {
    enter: 150,
    leave: 100,
  },
  version: cmnConfig.version,
  viewport: variantConfig.viewport,
};
