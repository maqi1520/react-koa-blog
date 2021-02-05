"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const config_1 = require("./config");
const winston_1 = require("winston");
const logger = (winstonInstance) => {
    winstonInstance.configure({
        level: config_1.config.debugLogging ? "debug" : "info",
        transports: [
            //
            // - Write all logs error (and below) to `error.log`.
            new winston_1.transports.File({ filename: "error.log", level: "error" }),
            //
            // - Write to all logs with specified level to console.
            new winston_1.transports.Console({
                format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.simple())
            })
        ]
    });
    return async (ctx, next) => {
        const start = new Date().getTime();
        await next();
        const ms = new Date().getTime() - start;
        let logLevel;
        if (ctx.status >= 500) {
            logLevel = "error";
        }
        else if (ctx.status >= 400) {
            logLevel = "warn";
        }
        else {
            logLevel = "info";
        }
        const msg = `${ctx.method} ${ctx.originalUrl} ${ctx.status} ${ms}ms`;
        winstonInstance.log(logLevel, msg);
    };
};
exports.logger = logger;
