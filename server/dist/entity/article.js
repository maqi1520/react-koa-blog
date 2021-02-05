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
exports.ArticleSchema = exports.Article = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const user_1 = require("./user");
const category_1 = require("./category");
const moment_1 = __importDefault(require("moment"));
let Article = class Article {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Article.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], Article.prototype, "title", void 0);
__decorate([
    typeorm_1.Column({
        nullable: true,
    }),
    __metadata("design:type", String)
], Article.prototype, "summary", void 0);
__decorate([
    typeorm_1.Column({
        select: false,
        type: 'text',
    }),
    __metadata("design:type", String)
], Article.prototype, "content", void 0);
__decorate([
    typeorm_1.Column({
        default: 1,
    }),
    __metadata("design:type", Number)
], Article.prototype, "readedCount", void 0);
__decorate([
    typeorm_1.ManyToMany((type) => category_1.Category, {
        cascade: true,
    }),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], Article.prototype, "categories", void 0);
__decorate([
    typeorm_1.ManyToOne((type) => user_1.User, (user) => user.articles),
    __metadata("design:type", user_1.User)
], Article.prototype, "user", void 0);
__decorate([
    typeorm_1.Column('int', { nullable: true }),
    __metadata("design:type", Number)
], Article.prototype, "userId", void 0);
__decorate([
    typeorm_1.Column({
        default: moment_1.default().format('YYYY-MM-DD HH:mm'),
    }),
    __metadata("design:type", String)
], Article.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.Column({
        default: moment_1.default().format('YYYY-MM-DD HH:mm'),
    }),
    __metadata("design:type", String)
], Article.prototype, "updatedAt", void 0);
Article = __decorate([
    typeorm_1.Entity()
], Article);
exports.Article = Article;
exports.ArticleSchema = {
    title: { type: 'string', required: true, example: 'Javier' },
    content: {
        type: 'string',
        required: true,
        example: '## content \n ### title3',
    },
    categories: {
        type: 'array',
        items: {
            type: 'object',
            properties: category_1.CategorySchema,
        },
    },
};
