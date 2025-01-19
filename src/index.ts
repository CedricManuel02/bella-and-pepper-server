import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { routes } from './controllers/routes.js'
import { errorHandlerMiddleware } from './middlewares/error-handler.js'

const app = new Hono()

app.onError(errorHandlerMiddleware)

routes.forEach((route) => {
  app.route("/", route);
});

const port = 3001
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
