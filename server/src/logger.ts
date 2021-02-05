import { BaseContext } from 'koa'
import { config } from './config'
import { transports, format } from 'winston'
import moment from 'moment'

const logger = (winstonInstance: any): any => {
  winstonInstance.configure({
    level: config.debugLogging ? 'debug' : 'info',
    transports: [
      //
      // - Write all logs error (and below) to `error.log`.
      new transports.File({ filename: 'error.log', level: 'error' }),
      //
      // - Write to all logs with specified level to console.
      new transports.Console({
        format: format.combine(format.colorize(), format.simple()),
      }),
    ],
  })

  return async (ctx: BaseContext, next: () => Promise<any>): Promise<void> => {
    const start = new Date().getTime()

    await next()

    const ms = new Date().getTime() - start

    let logLevel: string
    if (ctx.status >= 500) {
      logLevel = 'error'
    } else if (ctx.status >= 400) {
      logLevel = 'warn'
    } else {
      logLevel = 'info'
    }

    const msg = `${moment().format('YYYY-MM-DD HH:mm')} ${ctx.method} ${
      ctx.originalUrl
    } ${ctx.status} ${ms}ms`

    winstonInstance.log(logLevel, msg)
    if (ctx.method !== 'GET') {
      winstonInstance.log(logLevel, JSON.stringify(ctx.request.body))
    }
  }
}

export { logger }
