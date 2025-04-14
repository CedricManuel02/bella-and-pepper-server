import type { TVerficationToken } from "./token.types.js";

export type TAccountBase = {
  user_id: string;
};

export type TAccountChangePassword = TAccountBase & TAccountNewPassword;
export type TAccountLogin = TAccountEmail & TAccountPassword;
export type TAccountUpdatePassword = TAccountBase & TAccountPassword;

export type TAccountEmail = {
  user_email: string;
};
export type TAccountPassword = {
  user_password: string;
};
export type TAccountConfirmPassword = {
  confirm_password?: string;
};
export type TAccountNewPassword = {
  new_password: string;
}
export type TUpdateAccount = TAccountEmail & {
  user_phone?: string | null;
  user_profile?: string | null;
};

export type TAccount = TUpdateAccount &
  TAccountConfirmPassword &
  TAccountBase &
  TAccountRegister & {
    user_date_created: Date;
    user_date_updated: Date | null;
    roles: "ADMIN" | "USER";
  };


export type TAccountRegister = TAccountEmail & {
  user_name: string;
  user_password: string;
  user_is_verified?: string | null;
};

export type TAccountResetPassword = TAccountConfirmPassword & TAccountNewPassword & TVerficationToken