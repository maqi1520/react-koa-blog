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
exports.userSchema = exports.User = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const article_1 = require("./article");
let User = class User {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        length: 80,
    }),
    class_validator_1.Length(6, 80),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({
        length: 100,
    }),
    class_validator_1.Length(6, 100),
    class_validator_1.IsEmail(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    typeorm_1.Column({
        length: 20,
        select: false,
    }),
    class_validator_1.Length(6, 20),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    typeorm_1.OneToMany((type) => article_1.Article, (article) => article.user),
    __metadata("design:type", Array)
], User.prototype, "articles", void 0);
User = __decorate([
    typeorm_1.Entity()
], User);
exports.User = User;
exports.userSchema = {
    id: { type: 'number', required: true, example: 1 },
    name: { type: 'string', required: true, example: 'Javier' },
    password: {
        type: 'string',
        required: true,
        example: '123456',
    },
    email: {
        type: 'string',
        required: true,
        example: 'avileslopez.javier@gmail.com',
    },
};
