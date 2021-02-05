import { general, auth, comment } from './controller'
import Router from '@koa/router'
import { SwaggerRouter } from 'koa-swagger-decorator'
const unprotectedRouter = new Router()

// Hello World route
unprotectedRouter.get('/', general.helloWorld)
unprotectedRouter.post('/api/auth/login', auth.login)
unprotectedRouter.post('/api/auth/register', auth.register)

// comment ROUTES
unprotectedRouter.get('/api/comment', comment.query)
unprotectedRouter.post('/api/comment', comment.create)
unprotectedRouter.put('/api/comment/:id', comment.update)
unprotectedRouter.delete('/api/comment/:id', comment.remove)

const swaggerRouter = new SwaggerRouter()
// Swagger endpoint
swaggerRouter.swagger({
  title: 'node-typescript-koa-rest',
  description:
    'API REST using NodeJS and KOA framework, typescript. TypeORM for SQL with class-validators. Middlewares JWT, CORS, Winston Logger.',
  version: '1.5.0',
})

// dir mapDir将扫描输入,并自动调用路由器。
swaggerRouter.mapDir(__dirname)

export { unprotectedRouter, swaggerRouter }
