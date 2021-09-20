import Koa from "koa";
import bodyParser from "koa-bodyparser";

import unprotectedRouter from "../routes/unprotectedRoutes";
import protectedRouter from "../routes/protectedRoutes";

const app = new Koa();

// Enable bodyParser with default options
app.use(bodyParser())

// these routes are NOT protected by the JWT middleware, also include middleware to respond with "Method Not Allowed - 405".
app.use(unprotectedRouter.routes()).use(unprotectedRouter.allowedMethods())

// JWT middleware

// These routes are protected by the JWT middleware, also include middleware to respond with "Method Not Allowed - 405".
app.use(protectedRouter.routes()).use(protectedRouter.allowedMethods())

export default app;
