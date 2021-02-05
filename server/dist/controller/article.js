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
const article_1 = require("../entity/article");
const exceptions_1 = require("../exceptions");
let ArticleController = class ArticleController {
    static async getArticles(ctx) {
        const { pageSize = 20, pageNum = 1, title, tag } = ctx.request.query;
        const articleRepository = typeorm_1.getManager().getRepository(article_1.Article);
        // const where: FindConditions<Article> | FindConditions<Article>[] = {}
        // if (title) {
        //   where.title = Like(`%${title}%`)
        // }
        // const options: FindManyOptions<Article> = {
        //   where,
        //   relations: ['categories'],
        //   order: {
        //     createdAt: -1,
        //     updatedAt: -1,
        //   },
        //   skip: (pageNum - 1) * pageSize,
        //   take: pageSize,
        // }
        // const [data, total] = await articleRepository.findAndCount(options)
        const sql = articleRepository
            .createQueryBuilder('article')
            .innerJoinAndSelect('article.categories', 'category');
        if (title) {
            sql.where('article.title like :title ', { title: `%${title}%` });
        }
        if (tag) {
            sql.andWhere('category.name like :tag ', { tag: `%${tag}%` });
        }
        sql
            .orderBy({
            'article.createdAt': 'DESC',
            'article.updatedAt': 'DESC',
        })
            .skip((pageNum - 1) * pageSize)
            .take(pageSize);
        const [data, total] = await sql.getManyAndCount();
        ctx.status = 200;
        ctx.body = { data, total };
    }
    static async getArticle(ctx) {
        // get a article repository to perform operations with article
        const articleRepository = typeorm_1.getManager().getRepository(article_1.Article);
        // load article by id
        const article = await articleRepository
            .createQueryBuilder('article')
            .where({ id: +ctx.params.id || 0 })
            .addSelect('article.content')
            .leftJoinAndSelect('article.categories', 'category')
            .getOne();
        if (article) {
            article['readedCount'] = article['readedCount'] + 1;
            await articleRepository.save(article);
            // return OK status code and loaded article object
            ctx.status = 200;
            ctx.body = article;
        }
        else {
            // return a BAD REQUEST status code and error message
            ctx.status = 400;
            ctx.body =
                "The article you are trying to retrieve doesn't exist in the db";
        }
    }
    static async createArticle(ctx) {
        // get a article repository to perform operations with article
        const articleRepository = typeorm_1.getManager().getRepository(article_1.Article);
        // build up entity article to be saved
        const currentUser = new user_1.User();
        currentUser.id = ctx.state.user.id;
        const articleToBeSaved = articleRepository.create(ctx.request.body);
        // validate article entity
        const errors = await class_validator_1.validate(articleToBeSaved); // errors is an array of validation errors
        if (errors.length > 0) {
            // return BAD REQUEST status code and errors array
            ctx.status = 400;
            ctx.body = errors;
        }
        else {
            // save the article contained in the POST body
            const article = await articleRepository.save(articleToBeSaved);
            // return CREATED status code and updated article
            ctx.status = 201;
            ctx.body = article;
        }
    }
    static async updateArticle(ctx) {
        // get a article repository to perform operations with article
        const articleRepository = typeorm_1.getManager().getRepository(article_1.Article);
        const id = +ctx.params.id || 0;
        const articleToBeUpdated = await articleRepository.findOne(id);
        if (!articleToBeUpdated) {
            // check if a article with the specified id exists
            // return a BAD REQUEST status code and error message
            throw new exceptions_1.ErrorException("The article you are trying to update doesn't exist in the db");
        }
        articleRepository.merge(articleToBeUpdated, ctx.request.body);
        // validate article entity
        const errors = await class_validator_1.validate(articleToBeUpdated); // errors is an array of validation errors
        if (errors.length > 0) {
            // return BAD REQUEST status code and errors array
            ctx.status = 400;
            ctx.body = errors;
        }
        else {
            // save the article contained in the PUT body
            const article = await articleRepository.save(articleToBeUpdated);
            // return CREATED status code and updated article
            ctx.status = 201;
            ctx.body = article;
        }
    }
    static async deleteArticle(ctx) {
        // get a article repository to perform operations with article
        const articleRepository = typeorm_1.getManager().getRepository(article_1.Article);
        // find the article by specified id
        const articleToRemove = await articleRepository.findOne(+ctx.params.id || 0, {
            relations: ['user'],
        });
        console.log(articleToRemove);
        if (!articleToRemove) {
            // return a BAD REQUEST status code and error message
            ctx.status = 400;
            ctx.body = "The article you are trying to delete doesn't exist in the db";
        }
        else if (ctx.state.user.id !== articleToRemove.user.id) {
            // check user's token id and user id are the same
            // if not, return a FORBIDDEN status code and error message
            ctx.status = 403;
            ctx.body = 'only be deleted by himself';
        }
        else {
            // the article is there so can be removed
            await articleRepository.remove(articleToRemove);
            // return a NO CONTENT status code
            ctx.status = 204;
        }
    }
};
__decorate([
    koa_swagger_decorator_1.request('get', '/articles'),
    koa_swagger_decorator_1.summary('Find all articles'),
    koa_swagger_decorator_1.query({
        pageNum: { type: 'number', default: 1, description: 'pageNum' },
        pageSize: { type: 'number', default: 20, description: 'pageSize' },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArticleController, "getArticles", null);
__decorate([
    koa_swagger_decorator_1.request('get', '/articles/{id}'),
    koa_swagger_decorator_1.summary('Find article by id'),
    koa_swagger_decorator_1.path({
        id: { type: 'number', required: true, description: 'id of article' },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArticleController, "getArticle", null);
__decorate([
    koa_swagger_decorator_1.request('post', '/articles'),
    koa_swagger_decorator_1.summary('Create a article'),
    koa_swagger_decorator_1.body(article_1.ArticleSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArticleController, "createArticle", null);
__decorate([
    koa_swagger_decorator_1.request('put', '/articles/{id}'),
    koa_swagger_decorator_1.summary('Update a article'),
    koa_swagger_decorator_1.path({
        id: { type: 'number', required: true, description: 'id of article' },
    }),
    koa_swagger_decorator_1.body(article_1.ArticleSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArticleController, "updateArticle", null);
__decorate([
    koa_swagger_decorator_1.request('delete', '/articles/{id}'),
    koa_swagger_decorator_1.summary('Delete article by id'),
    koa_swagger_decorator_1.path({
        id: { type: 'number', required: true, description: 'id of article' },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArticleController, "deleteArticle", null);
ArticleController = __decorate([
    koa_swagger_decorator_1.responsesAll({
        200: { description: 'success' },
        400: { description: 'bad request' },
        401: { description: 'unauthorized, missing/wrong jwt token' },
    }),
    koa_swagger_decorator_1.tagsAll(['Article']),
    koa_swagger_decorator_1.prefix('/api')
], ArticleController);
exports.default = ArticleController;
