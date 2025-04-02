import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { routes } from './controllers/routes.js'
import { errorHandlerMiddleware } from './middlewares/error-handler.js'
import { cors } from 'hono/cors'
const app = new Hono()

app.use(cors({
  origin: ["http://localhost:3000"],
  credentials: true,
}));

app.onError(errorHandlerMiddleware)

routes.forEach((route) => {
  app.route("/", route);
});

job.start();

const port = 3001
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})

import "./socket/index.js";
import { job } from './utils/cron-job.js'
