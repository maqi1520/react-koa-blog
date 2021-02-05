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
const category_1 = require("../entity/category");
const exceptions_1 = require("../exceptions");
let CategoryController = class CategoryController {
    static async query(ctx) {
        const { pageSize = 20, pageNum = 1 } = ctx.request.query;
        const repository = typeorm_1.getManager().getRepository(category_1.Category);
        const [data, total] = await repository.findAndCount({
            skip: (pageNum - 1) * pageSize,
            take: pageSize,
        });
        ctx.status = 200;
        ctx.body = { data, total };
    }
    static async get(ctx) {
        const repository = typeorm_1.getManager().getRepository(category_1.Category);
        const category = await repository.findOne(+ctx.params.id || 0);
        if (category) {
            ctx.status = 200;
            ctx.body = category;
        }
        else {
            // return a BAD REQUEST status code and error message
            ctx.status = 400;
            ctx.body = "The id you are trying to retrieve doesn't exist in the db";
        }
    }
    static async update(ctx) {
        const repository = typeorm_1.getManager().getRepository(category_1.Category);
        const id = +ctx.params.id || 0;
        const toBeUpdated = await repository.findOne(id);
        if (!toBeUpdated) {
            // return a BAD REQUEST status code and error message
            throw new exceptions_1.ErrorException("The id you are trying to update doesn't exist in the db");
        }
        repository.merge(toBeUpdated, ctx.request.body);
        const errors = await class_validator_1.validate(toBeUpdated); // errors is an array of validation errors
        if (errors.length > 0) {
            // return BAD REQUEST status code and errors array
            ctx.status = 400;
            ctx.body = errors;
        }
        else {
            ctx.status = 201;
            ctx.body = await repository.save(toBeUpdated);
        }
    }
};
__decorate([
    koa_swagger_decorator_1.request('get', '/category'),
    koa_swagger_decorator_1.summary('Find all categorys'),
    koa_swagger_decorator_1.query({
        pageNum: { type: 'number', default: 1, description: 'pageNum' },
        pageSize: { type: 'number', default: 20, description: 'pageSize' },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CategoryController, "query", null);
__decorate([
    koa_swagger_decorator_1.request('get', '/category/{id}'),
    koa_swagger_decorator_1.summary('Find category by id'),
    koa_swagger_decorator_1.path({
        id: { type: 'number', required: true, description: 'id of category' },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CategoryController, "get", null);
__decorate([
    koa_swagger_decorator_1.request('put', '/category/{id}'),
    koa_swagger_decorator_1.summary('Update a category'),
    koa_swagger_decorator_1.path({
        id: { type: 'number', required: true, description: 'id of category' },
    }),
    koa_swagger_decorator_1.body(category_1.Category),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CategoryController, "update", null);
CategoryController = __decorate([
    koa_swagger_decorator_1.responsesAll({
        200: { description: 'success' },
        400: { description: 'bad request' },
        401: { description: 'unauthorized, missing/wrong jwt token' },
    }),
    koa_swagger_decorator_1.tagsAll(['category']),
    koa_swagger_decorator_1.prefix('/api')
], CategoryController);
exports.default = CategoryController;
