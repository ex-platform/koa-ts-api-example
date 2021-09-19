import Koa from "koa";
import bodyParser from "koa-bodyparser";

import unprotectedRouter from "../routes/unprotectedRoutes";

const app = new Koa();

// Enable bodyParser with default options
app.use(bodyParser())

// these routes are NOT protected by the JWT middleware, also include middleware to respond with "Method Not Allowed - 405".
app.use(unprotectedRouter.routes()).use(unprotectedRouter.allowedMethods())

export default app;
