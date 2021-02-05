"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectedRouter = void 0;
const controller_1 = require("./controller");
const router_1 = __importDefault(require("@koa/router"));
const protectedRouter = new router_1.default();
exports.protectedRouter = protectedRouter;
protectedRouter.prefix('/api');
protectedRouter.post('/auth/me', controller_1.auth.me);
// USER ROUTES
protectedRouter.get('/users', controller_1.user.getUsers);
protectedRouter.get('/users/:id', controller_1.user.getUser);
protectedRouter.post('/users', controller_1.user.createUser);
protectedRouter.put('/users/:id', controller_1.user.updateUser);
protectedRouter.delete('/users/:id', controller_1.user.deleteUser);
protectedRouter.delete('/testusers', controller_1.user.deleteTestUsers);
// article ROUTES
protectedRouter.get('/article', controller_1.article.getArticles);
protectedRouter.get('/article/:id', controller_1.article.getArticle);
protectedRouter.post('/article', controller_1.article.createArticle);
protectedRouter.put('/article/:id', controller_1.article.updateArticle);
protectedRouter.delete('/article/:id', controller_1.article.deleteArticle);
// star ROUTES
protectedRouter.get('/star', controller_1.star.query);
protectedRouter.get('/star/:id', controller_1.star.get);
protectedRouter.post('/star', controller_1.star.create);
protectedRouter.put('/star/:id', controller_1.star.update);
protectedRouter.delete('/star/:id', controller_1.star.remove);
// star ROUTES
protectedRouter.get('/category', controller_1.category.query);
protectedRouter.get('/category/:id', controller_1.category.get);
protectedRouter.put('/category/:id', controller_1.category.update);
