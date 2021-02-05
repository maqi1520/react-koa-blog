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
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const koa_swagger_decorator_1 = require("koa-swagger-decorator");
const user_1 = require("../entity/user");
let UserController = class UserController {
    static async getUsers(ctx) {
        // get a user repository to perform operations with user
        const userRepository = typeorm_1.getManager().getRepository(user_1.User);
        // load all users
        const users = await userRepository.find();
        // return OK status code and loaded users array
        ctx.status = 200;
        ctx.body = users;
    }
    static async getUser(ctx) {
        // get a user repository to perform operations with user
        const userRepository = typeorm_1.getManager().getRepository(user_1.User);
        // load user by id
        const user = await userRepository.findOne(+ctx.params.id || 0);
        if (user) {
            // return OK status code and loaded user object
            ctx.status = 200;
            ctx.body = user;
        }
        else {
            // return a BAD REQUEST status code and error message
            ctx.status = 400;
            ctx.body = "The user you are trying to retrieve doesn't exist in the db";
        }
    }
    static async createUser(ctx) {
        // get a user repository to perform operations with user
        const userRepository = typeorm_1.getManager().getRepository(user_1.User);
        if (await userRepository.findOne({ email: ctx.request.body.email })) {
            // return BAD REQUEST status code and email already exists error
            ctx.status = 400;
            ctx.body = 'The specified e-mail address already exists';
        }
        // build up entity user to be saved
        const userToBeSaved = userRepository.create(ctx.request.body);
        // validate user entity
        const errors = await class_validator_1.validate(userToBeSaved); // errors is an array of validation errors
        if (errors.length > 0) {
            // return BAD REQUEST status code and errors array
            ctx.status = 400;
            ctx.body = errors;
        }
        else {
            // save the user contained in the POST body
            const user = await userRepository.save(userToBeSaved);
            // return CREATED status code and updated user
            ctx.status = 201;
            ctx.body = user;
        }
    }
    static async updateUser(ctx) {
        // get a user repository to perform operations with user
        const userRepository = typeorm_1.getManager().getRepository(user_1.User);
        const id = +ctx.params.id || 0;
        const userToBeUpdated = await userRepository.findOne(id);
        if (!userToBeUpdated) {
            // check if a user with the specified id exists
            // return a BAD REQUEST status code and error message
            ctx.status = 400;
            ctx.body = "The user you are trying to update doesn't exist in the db";
        }
        // update the user by specified id
        // build up entity user to be updated
        userRepository.merge(userToBeUpdated, ctx.requet.body);
        // validate user entity
        const errors = await class_validator_1.validate(userToBeUpdated); // errors is an array of validation errors
        if (errors.length > 0) {
            // return BAD REQUEST status code and errors array
            ctx.status = 400;
            ctx.body = errors;
        }
        else if (await userRepository.findOne({
            id: typeorm_1.Not(typeorm_1.Equal(userToBeUpdated.id)),
            email: userToBeUpdated.email,
        })) {
            // return BAD REQUEST status code and email already exists error
            ctx.status = 400;
            ctx.body = 'The specified e-mail address already exists';
        }
        else {
            // save the user contained in the PUT body
            const user = await userRepository.save(userToBeUpdated);
            // return CREATED status code and updated user
            ctx.status = 201;
            ctx.body = user;
        }
    }
    static async deleteUser(ctx) {
        // get a user repository to perform operations with user
        const userRepository = typeorm_1.getManager().getRepository(user_1.User);
        // find the user by specified id
        const userToRemove = await userRepository.findOne(+ctx.params.id || 0);
        console.log(userToRemove);
        console.log(ctx.state.user.id);
        if (!userToRemove) {
            // return a BAD REQUEST status code and error message
            ctx.status = 400;
            ctx.body = "The user you are trying to delete doesn't exist in the db";
        }
        else if (ctx.state.user.id !== userToRemove.id) {
            // check user's token id and user id are the same
            // if not, return a FORBIDDEN status code and error message
            ctx.status = 403;
            ctx.body = 'A user can only be deleted by himself';
        }
        else {
            // the user is there so can be removed
            await userRepository.remove(userToRemove);
            // return a NO CONTENT status code
            ctx.status = 204;
        }
    }
    static async deleteTestUsers(ctx) {
        // get a user repository to perform operations with user
        const userRepository = typeorm_1.getManager().getRepository(user_1.User);
        // find test users
        const usersToRemove = await userRepository.find({
            where: { email: typeorm_1.Like('%@citest.com') },
        });
        // the user is there so can be removed
        await userRepository.remove(usersToRemove);
        // return a NO CONTENT status code
        ctx.status = 204;
    }
};
__decorate([
    koa_swagger_decorator_1.request('get', '/users'),
    koa_swagger_decorator_1.summary('Find all users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController, "getUsers", null);
__decorate([
    koa_swagger_decorator_1.request('get', '/users/{id}'),
    koa_swagger_decorator_1.summary('Find user by id'),
    koa_swagger_decorator_1.path({
        id: { type: 'number', required: true, description: 'id of user' },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController, "getUser", null);
__decorate([
    koa_swagger_decorator_1.request('post', '/users'),
    koa_swagger_decorator_1.summary('Create a user'),
    koa_swagger_decorator_1.body(user_1.userSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController, "createUser", null);
__decorate([
    koa_swagger_decorator_1.request('put', '/users/{id}'),
    koa_swagger_decorator_1.summary('Update a user'),
    koa_swagger_decorator_1.path({
        id: { type: 'number', required: true, description: 'id of user' },
    }),
    koa_swagger_decorator_1.body(user_1.userSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController, "updateUser", null);
__decorate([
    koa_swagger_decorator_1.request('delete', '/users/{id}'),
    koa_swagger_decorator_1.summary('Delete user by id'),
    koa_swagger_decorator_1.path({
        id: { type: 'number', required: true, description: 'id of user' },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController, "deleteUser", null);
__decorate([
    koa_swagger_decorator_1.request('delete', '/testusers'),
    koa_swagger_decorator_1.summary('Delete users generated by integration and load tests'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController, "deleteTestUsers", null);
UserController = __decorate([
    koa_swagger_decorator_1.responsesAll({
        200: { description: 'success' },
        400: { description: 'bad request' },
        401: { description: 'unauthorized, missing/wrong jwt token' },
    }),
    koa_swagger_decorator_1.tagsAll(['User']),
    koa_swagger_decorator_1.prefix('/api')
], UserController);
exports.default = UserController;
