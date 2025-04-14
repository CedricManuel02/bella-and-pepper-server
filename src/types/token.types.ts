import type { TAccountBase } from "./account.types.js";

export type TAccountResetTokenBase = {
  reset_token_id: string;
};
export type TAccountResetTokenHash = {
  reset_token_hash: string;
};
// 🔑 Token Types
export type TAccountResetToken = TAccountBase &
  TAccountResetTokenHash & {
    reset_token_expires_at: Date;
};

export type TVerficationToken = {
  reset_token: string;
}