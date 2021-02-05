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
exports.StarSchema = exports.Star = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const moment_1 = __importDefault(require("moment"));
let Star = class Star {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Star.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], Star.prototype, "title", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Star.prototype, "url", void 0);
__decorate([
    typeorm_1.Column({
        default: moment_1.default().format('YYYY-MM-DD HH:mm'),
    }),
    __metadata("design:type", String)
], Star.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.Column({
        default: moment_1.default().format('YYYY-MM-DD HH:mm'),
    }),
    __metadata("design:type", String)
], Star.prototype, "updatedAt", void 0);
Star = __decorate([
    typeorm_1.Entity()
], Star);
exports.Star = Star;
exports.StarSchema = {
    title: { type: 'string', required: true, example: 'Javier' },
    url: { type: 'string', required: true, example: 'http://www/baidu.com/' },
};
