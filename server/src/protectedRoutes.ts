import { user, article, auth, star, category } from './controller'
import Router from '@koa/router'

const protectedRouter = new Router()

protectedRouter.prefix('/api')

protectedRouter.post('/auth/me', auth.me)
// USER ROUTES
protectedRouter.get('/users', user.getUsers)
protectedRouter.get('/users/:id', user.getUser)
protectedRouter.post('/users', user.createUser)
protectedRouter.put('/users/:id', user.updateUser)
protectedRouter.delete('/users/:id', user.deleteUser)
protectedRouter.delete('/testusers', user.deleteTestUsers)

// article ROUTES
protectedRouter.get('/article', article.getArticles)
protectedRouter.get('/article/:id', article.getArticle)
protectedRouter.post('/article', article.createArticle)
protectedRouter.put('/article/:id', article.updateArticle)
protectedRouter.delete('/article/:id', article.deleteArticle)

// star ROUTES
protectedRouter.get('/star', star.query)
protectedRouter.get('/star/:id', star.get)
protectedRouter.post('/star', star.create)
protectedRouter.put('/star/:id', star.update)
protectedRouter.delete('/star/:id', star.remove)

// star ROUTES
protectedRouter.get('/category', category.query)
protectedRouter.get('/category/:id', category.get)
protectedRouter.put('/category/:id', category.update)

export { protectedRouter }
