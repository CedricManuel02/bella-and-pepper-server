import { Hono } from "hono";
import { adminAuthenticationMiddlewares } from "../../middlewares/admin-authentication-handler.js";
import { getDashboardAnalyticsController, getDashboardChartController } from "./index.js";

const router = new Hono()
.use("/auth/dashboard/*", adminAuthenticationMiddlewares)
.get("/auth/dashboard-analytics", getDashboardAnalyticsController)
.get("/auth/dashboard-chart", getDashboardChartController)

export default router;