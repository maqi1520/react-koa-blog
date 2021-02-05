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
const star_1 = require("../entity/star");
const exceptions_1 = require("../exceptions");
let StarController = class StarController {
    static async query(ctx) {
        const { pageSize = 20, pageNum = 1 } = ctx.request.query;
        const repository = typeorm_1.getManager().getRepository(star_1.Star);
        const [data, total] = await repository.findAndCount({
            skip: (pageNum - 1) * pageSize,
            take: pageSize,
        });
        ctx.status = 200;
        ctx.body = { data, total };
    }
    static async get(ctx) {
        const repository = typeorm_1.getManager().getRepository(star_1.Star);
        const star = await repository.findOne(+ctx.params.id || 0);
        if (star) {
            ctx.status = 200;
            ctx.body = star;
        }
        else {
            // return a BAD REQUEST status code and error message
            ctx.status = 400;
            ctx.body = "The id you are trying to retrieve doesn't exist in the db";
        }
    }
    static async create(ctx) {
        const repository = typeorm_1.getManager().getRepository(star_1.Star);
        const starToBeSaved = repository.create(ctx.request.body);
        const errors = await class_validator_1.validate(starToBeSaved); // errors is an array of validation errors
        if (errors.length > 0) {
            // return BAD REQUEST status code and errors array
            ctx.status = 400;
            ctx.body = errors;
        }
        else {
            const star = await repository.save(starToBeSaved);
            ctx.status = 201;
            ctx.body = star;
        }
    }
    static async update(ctx) {
        const repository = typeorm_1.getManager().getRepository(star_1.Star);
        const id = +ctx.params.id || 0;
        const starToBeUpdated = await repository.findOne(id);
        if (!starToBeUpdated) {
            // return a BAD REQUEST status code and error message
            throw new exceptions_1.ErrorException("The id you are trying to update doesn't exist in the db");
        }
        repository.merge(starToBeUpdated, ctx.request.body);
        const errors = await class_validator_1.validate(starToBeUpdated); // errors is an array of validation errors
        if (errors.length > 0) {
            // return BAD REQUEST status code and errors array
            ctx.status = 400;
            ctx.body = errors;
        }
        else {
            ctx.status = 201;
            ctx.body = await repository.save(starToBeUpdated);
        }
    }
    static async remove(ctx) {
        const repository = typeorm_1.getManager().getRepository(star_1.Star);
        const starToRemove = await repository.findOne(+ctx.params.id || 0);
        if (!starToRemove) {
            // return a BAD REQUEST status code and error message
            ctx.status = 400;
            ctx.body = "The id you are trying to delete doesn't exist in the db";
        }
        else {
            await repository.remove(starToRemove);
            // return a NO CONTENT status code
            ctx.status = 204;
        }
    }
};
__decorate([
    koa_swagger_decorator_1.request('get', '/star'),
    koa_swagger_decorator_1.summary('Find all stars'),
    koa_swagger_decorator_1.query({
        pageNum: { type: 'number', default: 1, description: 'pageNum' },
        pageSize: { type: 'number', default: 20, description: 'pageSize' },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StarController, "query", null);
__decorate([
    koa_swagger_decorator_1.request('get', '/star/{id}'),
    koa_swagger_decorator_1.summary('Find star by id'),
    koa_swagger_decorator_1.path({
        id: { type: 'number', required: true, description: 'id of star' },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StarController, "get", null);
__decorate([
    koa_swagger_decorator_1.request('post', '/star'),
    koa_swagger_decorator_1.summary('Create a star'),
    koa_swagger_decorator_1.body(star_1.StarSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StarController, "create", null);
__decorate([
    koa_swagger_decorator_1.request('put', '/star/{id}'),
    koa_swagger_decorator_1.summary('Update a star'),
    koa_swagger_decorator_1.path({
        id: { type: 'number', required: true, description: 'id of star' },
    }),
    koa_swagger_decorator_1.body(star_1.Star),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StarController, "update", null);
__decorate([
    koa_swagger_decorator_1.request('delete', '/star/{id}'),
    koa_swagger_decorator_1.summary('Delete star by id'),
    koa_swagger_decorator_1.path({
        id: { type: 'number', required: true, description: 'id of star' },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StarController, "remove", null);
StarController = __decorate([
    koa_swagger_decorator_1.responsesAll({
        200: { description: 'success' },
        400: { description: 'bad request' },
        401: { description: 'unauthorized, missing/wrong jwt token' },
    }),
    koa_swagger_decorator_1.tagsAll(['star']),
    koa_swagger_decorator_1.prefix('/api')
], StarController);
exports.default = StarController;
