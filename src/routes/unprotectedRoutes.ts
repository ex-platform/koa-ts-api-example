import { BaseContext } from "koa";
import Router from "@koa/router"

class GeneralController {
  public static async helloWorld(ctx: BaseContext): Promise<void> {
    ctx.body = "Hello World!"
  }
}

const unprotectedRouter = new Router()

unprotectedRouter.get('/', GeneralController.helloWorld)

export default unprotectedRouter
