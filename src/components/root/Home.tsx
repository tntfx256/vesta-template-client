import { IComponentProps, Navbar } from "@vesta/components";
import { Culture } from "@vesta/culture";
import React, { ComponentType } from "react";
import { RouteComponentProps } from "react-router";
import { useStore } from "../../service/Store";

interface IHomeParams {}

interface IHomeProps extends IComponentProps, RouteComponentProps<IHomeParams> {}

export const Home: ComponentType<IHomeProps> = (props: IHomeProps) => {
  const tr = Culture.getDictionary().translate;
  const { dispatch } = useStore();

  return (
    <div className="page home-page has-navbar">
      <Navbar title={tr("home")} onBurgerClick={() => dispatch({ navbar: true })} />
      <h1>home page</h1>
    </div>
  );
};
