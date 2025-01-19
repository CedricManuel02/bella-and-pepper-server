import AccountRoutes from "./account/routes.js"

export const routes = [AccountRoutes] as const;

export type AppRoutes = (typeof routes)[number]