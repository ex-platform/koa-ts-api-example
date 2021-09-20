const path = require('path')
import { SwaggerRouter } from "koa-swagger-decorator";

import UserController from '../controller/user'

const protectedRouter = new SwaggerRouter()

// USER ROUTES
protectedRouter.get("/users", UserController.getUsers);
protectedRouter.get("/users/:id", UserController.getUser);
protectedRouter.post("/users", UserController.createUser);
protectedRouter.put("/users/:id", UserController.updateUser);
protectedRouter.delete("/users/:id", UserController.deleteUser);
protectedRouter.delete("/testusers", UserController.deleteTestUsers);

// Swagger endpoint
protectedRouter.swagger({
  title: "koa-ts-api-example",
  description: "REST API using KOA framework, typescript, TypeORM.",
  version: "0.0.1"
});

// mapDir will scan the input dir, and automatically call router.map to all Router Class
protectedRouter.mapDir(path.resolve(__dirname, '../controller'));

export default protectedRouter;