"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const koa_jwt_1 = __importDefault(require("koa-jwt"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const koa_helmet_1 = __importDefault(require("koa-helmet"));
const cors_1 = __importDefault(require("@koa/cors"));
const winston_1 = __importDefault(require("winston"));
const typeorm_1 = require("typeorm");
require("reflect-metadata");
const logger_1 = require("./logger");
const config_1 = require("./config");
const unprotectedRoutes_1 = require("./unprotectedRoutes");
const protectedRoutes_1 = require("./protectedRoutes");
const cron_1 = require("./cron");
// create connection with database
// note that its not active database connection
// TypeORM creates you connection pull to uses connections from pull on your requests
typeorm_1.createConnection({
    type: 'mysql',
    host: config_1.config.dbHost,
    port: 3306,
    username: config_1.config.dbUser,
    password: config_1.config.dbPassWord,
    database: config_1.config.dbDatabase,
    synchronize: true,
    entities: config_1.config.dbEntitiesPath,
    logging: true,
})
    .then(async () => {
    const app = new koa_1.default();
    // Provides important security headers to make your app more secure
    app.use(koa_helmet_1.default());
    // Enable cors with default options
    app.use(cors_1.default());
    // Logger middleware -> use winston as logger (logging.ts with config)
    app.use(logger_1.logger(winston_1.default));
    // Enable bodyParser with default options
    app.use(koa_bodyparser_1.default());
    app.use(async (ctx, next) => {
        try {
            await next();
        }
        catch (err) {
            // 只返回 JSON 格式的响应
            ctx.status = err.status || 500;
            ctx.body = { message: err.message };
        }
    });
    // these routes are NOT protected by the JWT middleware, also include middleware to respond with "Method Not Allowed - 405".
    app.use(unprotectedRoutes_1.unprotectedRouter.routes()).use(unprotectedRoutes_1.unprotectedRouter.allowedMethods());
    // JWT middleware -> below this line routes are only reached if JWT token is valid, secret as env variable
    // do not protect swagger-json and swagger-html endpoints
    app.use(koa_jwt_1.default({ secret: config_1.config.jwtSecret }).unless({
        method: 'GET',
        path: [/^\/swagger-/],
    }));
    // These routes are protected by the JWT middleware, also include middleware to respond with "Method Not Allowed - 405".
    app.use(protectedRoutes_1.protectedRouter.routes()).use(protectedRoutes_1.protectedRouter.allowedMethods());
    app.use(unprotectedRoutes_1.swaggerRouter.routes()).use(unprotectedRoutes_1.swaggerRouter.allowedMethods());
    // Register cron job to do any action needed
    cron_1.cron.start();
    app.listen(config_1.config.port);
    console.log(`Server running on port ${config_1.config.port}`);
})
    .catch((error) => console.log('TypeORM connection error: ', error));
