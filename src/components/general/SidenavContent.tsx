import { Avatar, IComponentProps, Icon, IMenuItem, Menu, Navbar, Select } from "@vesta/components";
import { Culture } from "@vesta/culture";
import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import { IUser } from "../../cmn/models/User";
import { AppAction } from "../../misc/AppAction";
import { appStore } from "../../misc/appStore";
import { getFileUrl } from "../../util";

interface ISidenavContentProps extends IComponentProps {
  menuItems: IMenuItem[];
  name: string;
}

interface ISidenavContentState {
  locale: number;
  user: IUser;
}

export class SidenavContent extends PureComponent<ISidenavContentProps, ISidenavContentState> {
  private tr = Culture.getDictionary().translate;
  private localeOptions = [
    { id: 1, locale: "fa-IR", title: this.tr("persian") },
    { id: 2, locale: "en-US", title: this.tr("english") },
  ];

  public constructor(props: ISidenavContentProps) {
    super(props);
    const locale = Culture.getLocale().code;
    this.state = { locale: locale === "fa-IR" ? 1 : 2, user: getAuthInstance().getUser() };
  }

  public render() {
    const { menuItems } = this.props;
    const { locale, user } = this.state;
    const editLink =
      user && user.id ? (
        <Link to="/profile" onClick={this.closeSidenav}>
          <Icon name="settings" />
        </Link>
      ) : null;
    let userImage: string = "";
    if (user && user.image) {
      userImage = getFileUrl(`user/${user.image}`);
    }

    return (
      <div className="sidenav-content has-navbar">
        <Navbar onClose={this.closeSidenav} />
        <Select name="lng" value={locale} options={this.localeOptions} onChange={this.onLocaleChange} />
        <header>
          <Avatar src={userImage} defaultSrc="images/icons/192x192.png" />
          <div className="name-wrapper">
            <h4>
              {user.username} {editLink}
            </h4>
          </div>
        </header>
        <main>
          <Menu name="nav" items={menuItems} onItemSelect={this.closeSidenav} />
        </main>
      </div>
    );
  }

  private closeSidenav = () => {
    appStore.dispatch({ type: AppAction.Sidenav, payload: { isSidenavOpen: false } });
  };

  private onLocaleChange = (name: string, value: number) => {
    const locale = this.localeOptions[value - 1].locale;
    Culture.setDefault(locale);
    (window as any).loadLocale(locale, true);
  };
}
