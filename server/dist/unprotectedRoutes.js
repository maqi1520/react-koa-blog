"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerRouter = exports.unprotectedRouter = void 0;
const controller_1 = require("./controller");
const router_1 = __importDefault(require("@koa/router"));
const koa_swagger_decorator_1 = require("koa-swagger-decorator");
const unprotectedRouter = new router_1.default();
exports.unprotectedRouter = unprotectedRouter;
// Hello World route
unprotectedRouter.get('/', controller_1.general.helloWorld);
unprotectedRouter.post('/api/auth/login', controller_1.auth.login);
unprotectedRouter.post('/api/auth/register', controller_1.auth.register);
const swaggerRouter = new koa_swagger_decorator_1.SwaggerRouter();
exports.swaggerRouter = swaggerRouter;
// Swagger endpoint
swaggerRouter.swagger({
    title: 'node-typescript-koa-rest',
    description: 'API REST using NodeJS and KOA framework, typescript. TypeORM for SQL with class-validators. Middlewares JWT, CORS, Winston Logger.',
    version: '1.5.0',
});
// dir mapDir将扫描输入,并自动调用路由器。
swaggerRouter.mapDir(__dirname);
