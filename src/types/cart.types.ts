import type { TAccountUserID } from "./account.types.js";
import type { TProductID } from "./product.types.js";
import type { TVariantID, TVariants } from "./variant.types.js";

export type TCartID = {
  cart_id: string;
};

export type TCartQuantity = {
  item_quantity: number;
};

export type TCartCreate = TProductID & TAccountUserID & TVariantID & TCartQuantity;
export type TCartExisting = TAccountUserID & TVariantID;
export type TCartUpdate = TCartID & TCartQuantity;
export type TCartDelete = TCartID & TAccountUserID;
export type TCartVariantID = TVariantID & TAccountUserID;
export type TCart = TCartID & TAccountUserID;

export type TCartUpdateAction = TCartID &
  TCartQuantity &
  TAccountUserID & {
    action: string;
  };

export type TCartByVariantID =  TAccountUserID & {
  variant: any;
};

export type TCartIsExisting = TCartID & TAccountUserID;