import type { TAccountBase } from "./account.types.js";
export type TSessionBase = {
  session_id: string;
};

export type TSessionCreate = TSessionToken & TSession & TAccountBase;

export type TSessionToken = {
  session_token: string;
}

export type TSession = {
  session_expires_at: Date;
};

export type TSessionExtendedExpiresAt = {
  extended_expires_at: Date;
};
export type TSessionUpdate = TSessionBase & TSessionToken & TSessionExtendedExpiresAt;
