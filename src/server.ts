import Koa from "koa";

import appInstance from './app'
import { config } from './app/config'


const app: Koa = appInstance

app.listen(config.port, () => {
  console.log(`Koa server is listeng on port ${config.port}`)
})