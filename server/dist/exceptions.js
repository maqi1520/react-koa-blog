"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenException = exports.UnauthorizedException = exports.ErrorException = exports.NotFoundException = exports.BaseException = void 0;
class BaseException extends Error {
}
exports.BaseException = BaseException;
class NotFoundException extends BaseException {
    constructor(msg) {
        super();
        this.status = 404;
        this.message = msg || '无此内容';
    }
}
exports.NotFoundException = NotFoundException;
class ErrorException extends BaseException {
    constructor(msg) {
        super();
        this.status = 400;
        this.message = msg || '数据验证错误';
    }
}
exports.ErrorException = ErrorException;
class UnauthorizedException extends BaseException {
    constructor(msg) {
        super();
        this.status = 401;
        this.message = msg || '尚未登录';
    }
}
exports.UnauthorizedException = UnauthorizedException;
class ForbiddenException extends BaseException {
    constructor(msg) {
        super();
        this.status = 403;
        this.message = msg || '权限不足';
    }
}
exports.ForbiddenException = ForbiddenException;
