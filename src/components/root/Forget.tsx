import { Button, FormWrapper, IComponentProps, PageTitle, Preloader, TextInput } from "@vesta/components";
import { IModelValidationMessage, IResponse, IValidationError, validationMessage } from "@vesta/core";
import { Culture } from "@vesta/culture";
import React, { FunctionComponent, useState } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { IUser, User } from "../../cmn/models/User";
import vestaLogo from "../../images/logo.png";
import { getApiInstance } from "../../service/Api";
import { Notif } from "../../service/Notif";

// tslint:disable-next-line: no-empty-interface
interface IForgetParams {}

interface IForgetProps extends IComponentProps, RouteComponentProps<IForgetParams> {}

export const Forget: FunctionComponent<IForgetProps> = (props: IForgetProps) => {
  const tr = Culture.getDictionary().translate;
  const notif = Notif.getInstance();
  const api = getApiInstance();
  const formErrorsMessages: IModelValidationMessage = {
    mobile: {
      invalid: tr("err_invalid_phone"),
      maxLength: tr("err_max_length", 12),
      minLength: tr("err_min_length", 9),
      required: tr("err_required"),
      type: tr("err_phone"),
    },
  };
  // states
  const [mobile, setMobile] = useState<string>("");
  const [validationErrors, setErrors] = useState<IValidationError>(null);

  const errors = validationErrors ? validationMessage(formErrorsMessages, validationErrors) : {};

  return (
    <div className="page forget-page has-navbar page-logo-form">
      <PageTitle title={tr("forget_pass")} />
      <div className="logo-wrapper">
        <div className="logo-container">
          <img src={vestaLogo} alt="Vesta Logo" />
        </div>
      </div>
      <FormWrapper name="ForgetForm" onSubmit={onSubmit}>
        {alert}
        <TextInput name="mobile" label={tr("fld_mobile")} value={mobile} error={errors.mobile} onChange={onChange} />
        <div className="btn-group">
          <Button type="button" color="primary" variant="outlined">
            <Link to="/">{tr("login")}</Link>
          </Button>
          <Button color="primary" variant="contained">
            {tr("send_reset")}
          </Button>
        </div>
      </FormWrapper>
    </div>
  );

  function onChange(name: string, value: any) {
    setMobile(value);
  }

  function onSubmit() {
    const user = new User({ mobile });
    const vErrors = user.validate("mobile");
    if (vErrors) {
      return setErrors(vErrors);
    }
    Preloader.show();
    setErrors(null);
    api
      .post<IUser, IResponse<IUser>>("account/forget", { mobile })
      .then(response => {
        Preloader.hide();
        notif.success(tr("info_forget"));
        props.history.push("/");
      })
      .catch(error => {
        Preloader.hide();
        setErrors(error.violations);
      });
  }
};
