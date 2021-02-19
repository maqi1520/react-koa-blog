import Koa from 'koa'
import jwt from 'koa-jwt'
import bodyParser from 'koa-bodyparser'
import helmet from 'koa-helmet'
import cors from '@koa/cors'
import winston from 'winston'
import { createConnection } from 'typeorm'
import 'reflect-metadata'

import { logger } from './logger'
import { config } from './config'
import { unprotectedRouter, swaggerRouter } from './unprotectedRoutes'
import { protectedRouter } from './protectedRoutes'
import { cron } from './cron'

const __dev__ = process.env.NODE_ENV === "development";

// create connection with database
// note that its not active database connection
// TypeORM creates you connection pull to uses connections from pull on your requests
createConnection({
  charset: 'utf8mb4_unicode_ci',
  type: 'mysql',
  host: config.dbHost,
  port: 3306,
  username: config.dbUser,
  password: config.dbPassWord,
  database: config.dbDatabase,
  entities: config.dbEntitiesPath,
  synchronize:  __dev__,
  logging:__dev__,
})
  .then(async () => {
    const app = new Koa()

    // Provides important security headers to make your app more secure
    app.use(helmet())

    // Enable cors with default options
    app.use(cors())

    // Logger middleware -> use winston as logger (logging.ts with config)
    app.use(logger(winston))

    // Enable bodyParser with default options
    app.use(bodyParser())

    app.use(async (ctx, next) => {
      try {
        await next()
      } catch (err) {
        // 只返回 JSON 格式的响应
        ctx.status = err.status || 500
        ctx.body = { message: err.message }
      }
    })

    // these routes are NOT protected by the JWT middleware, also include middleware to respond with "Method Not Allowed - 405".
    app.use(unprotectedRouter.routes()).use(unprotectedRouter.allowedMethods())

    // JWT middleware -> below this line routes are only reached if JWT token is valid, secret as env variable
    // do not protect swagger-json and swagger-html endpoints
    app.use(
      jwt({ secret: config.jwtSecret }).unless({
        method: 'GET',
        path: [/^\/swagger-/],
      })
    )

    // These routes are protected by the JWT middleware, also include middleware to respond with "Method Not Allowed - 405".
    app.use(protectedRouter.routes()).use(protectedRouter.allowedMethods())
    app.use(swaggerRouter.routes()).use(swaggerRouter.allowedMethods())

    // Register cron job to do any action needed
    cron.start()

    app.listen(config.port)

    console.log(`Server running on port ${config.port}`)
  })
  .catch((error: string) => console.log('TypeORM connection error: ', error))
