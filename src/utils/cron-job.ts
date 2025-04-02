import { CronJob } from "cron";
import { deleteOrderCronJobService } from "../services/order/index.js";

export const job = new CronJob("0 * * * * *",async function () {
    console.log("RUNNING EVERY MINUTE CRON JOB")
    await deleteOrderCronJobService();
});

