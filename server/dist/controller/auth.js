"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import * as argon2 from 'argon2';
const typeorm_1 = require("typeorm");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const koa_swagger_decorator_1 = require("koa-swagger-decorator");
const user_1 = require("../entity/user");
const config_1 = require("../config");
const exceptions_1 = require("../exceptions");
const class_validator_1 = require("class-validator");
let AuthController = class AuthController {
    static async login(ctx) {
        const userRepository = typeorm_1.getManager().getRepository(user_1.User);
        const user = await userRepository
            .createQueryBuilder()
            .where({ email: ctx.request.body.email })
            .addSelect('User.password')
            .getOne();
        if (!user) {
            throw new exceptions_1.ErrorException('邮箱未注册');
            //} else if (await argon2.verify(user.password, ctx.request.body.password)) {
        }
        else if (user.password === String(ctx.request.body.password)) {
            const token = jsonwebtoken_1.default.sign({ id: user.id }, config_1.config.jwtSecret);
            ctx.status = 200;
            ctx.cookies.set('token', token, {
                httpOnly: true,
            });
            ctx.body = { token };
        }
        else {
            throw new exceptions_1.ErrorException('密码错误');
        }
    }
    static async register(ctx) {
        const userRepository = typeorm_1.getManager().getRepository(user_1.User);
        const user = await userRepository
            .createQueryBuilder()
            .where({ email: ctx.request.body.email })
            .getOne();
        if (user) {
            throw new exceptions_1.ErrorException('该邮箱已经注册');
        }
        const newUser = userRepository.create(ctx.request.body);
        // validate user entity
        const errors = await class_validator_1.validate(newUser);
        if (errors.length > 0) {
            // return BAD REQUEST status code and errors array
            ctx.status = 400;
            ctx.body = errors;
        }
        else {
            // 保存到数据库
            const user = await userRepository.save(newUser);
            ctx.status = 201;
            ctx.body = Object.assign(Object.assign({}, user), { password: undefined });
        }
    }
    static async me(ctx) {
        if (ctx.state.user && ctx.state.user.id) {
            const userRepository = typeorm_1.getManager().getRepository(user_1.User);
            // load user by id
            const user = await userRepository.findOne(+ctx.state.user.id || 0);
            // return OK status code and loaded user object
            ctx.status = 200;
            ctx.body = user;
        }
        else {
            throw new exceptions_1.UnauthorizedException('请登录');
        }
    }
};
__decorate([
    koa_swagger_decorator_1.request('post', '/auth/login'),
    koa_swagger_decorator_1.summary('login'),
    koa_swagger_decorator_1.body(Object.assign(Object.assign({}, user_1.userSchema), { id: undefined, name: undefined })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController, "login", null);
__decorate([
    koa_swagger_decorator_1.request('post', '/auth/register'),
    koa_swagger_decorator_1.summary('register'),
    koa_swagger_decorator_1.body(Object.assign(Object.assign({}, user_1.userSchema), { id: undefined })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController, "register", null);
__decorate([
    koa_swagger_decorator_1.request('post', '/auth/me'),
    koa_swagger_decorator_1.summary('get current user Info'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController, "me", null);
AuthController = __decorate([
    koa_swagger_decorator_1.tagsAll(['Auth']),
    koa_swagger_decorator_1.prefix('/api')
], AuthController);
exports.default = AuthController;
