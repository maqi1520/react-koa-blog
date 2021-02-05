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
const koa_swagger_decorator_1 = require("koa-swagger-decorator");
let GeneralController = class GeneralController {
    static async helloWorld(ctx) {
        ctx.body = "Hello World!";
    }
};
__decorate([
    koa_swagger_decorator_1.request("get", "/"),
    koa_swagger_decorator_1.summary("Welcome page"),
    koa_swagger_decorator_1.description("A simple welcome message to verify the service is up and running."),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GeneralController, "helloWorld", null);
GeneralController = __decorate([
    koa_swagger_decorator_1.tagsAll(["General"])
], GeneralController);
exports.default = GeneralController;
