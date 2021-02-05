import dotenv from 'dotenv'

dotenv.config({ path: '.env' })

export interface Config {
  port: number
  debugLogging: boolean
  jwtSecret: string
  dbHost: string
  dbUser: string
  dbPassWord: string
  dbDatabase: string
  dbEntitiesPath: string[]
  cronJobExpression: string
}

const isDevMode = process.env.NODE_ENV == 'development'

const config: Config = {
  port: +(process.env.PORT || 3000),
  debugLogging: isDevMode,
  jwtSecret: process.env.JWT_SECRET || 'your-secret-whatever',
  dbHost: process.env.DB_HOST,
  dbUser: process.env.DB_USER,
  dbPassWord: process.env.DB_PASSWORD,
  dbDatabase: process.env.DB_NAME,
  dbEntitiesPath: [
    ...(isDevMode ? ['src/entity/**/*.ts'] : ['dist/entity/**/*.js']),
  ],
  cronJobExpression: '0 * * * *',
}

export { config }
