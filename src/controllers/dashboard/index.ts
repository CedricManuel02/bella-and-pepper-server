import type { Context } from "hono";
import { StatusCodes } from "http-status-codes";
import { getDashboardAnalyticsService, getDashboardChartService } from "../../services/dashboard/index.js";

export async function getDashboardAnalyticsController(c: Context) {

    const data = await getDashboardAnalyticsService();

    return c.json({data, status: StatusCodes.ACCEPTED});
}

export async function getDashboardChartController(c: Context) {

    const data = await getDashboardChartService();

    return c.json({data, status: StatusCodes.ACCEPTED});
}