import AccountRoutes from "./account/routes.js";
import CategoryRoutes from "./categories/routes.js";
import ProductRoutes from "./product/routes.js";
import VariantRoutes from "./variant/routes.js";
import CartRoutes from "./cart/routes.js";
import ShippingRoutes from "./shipping/routes.js";
import CheckoutRoutes from "./checkout/routes.js";
import WebhookRoutes from "./webhook/routes.js";
import OrderRoutes from "./order/routes.js";
import ShippedRoutes from "./shipped/routes.js";
import NotificationRoutes from "./notification/routes.js";
import RatingRoutes from "./rating/routes.js";

export const routes = [
  AccountRoutes,
  CategoryRoutes,
  ProductRoutes,
  VariantRoutes,
  CartRoutes,
  ShippingRoutes,
  CheckoutRoutes,
  WebhookRoutes,
  OrderRoutes,
  ShippedRoutes,
  NotificationRoutes,
  RatingRoutes
] as const;

export type AppRoutes = (typeof routes)[number];
