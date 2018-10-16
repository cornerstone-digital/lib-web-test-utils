"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = require("debug");
const logger_types_1 = require("./logger.types");
class LoggerService {
    constructor(namespace, config) {
        this.instance = debug_1.default(namespace);
        this.level = config.level;
        this.enabled = config.enabled;
        return this;
    }
    trace(...args) {
        if (this.enabled && this.level >= logger_types_1.LogLevels.TRACE) {
            this.instance(args);
        }
    }
    info(...args) {
        if (this.enabled && this.level >= logger_types_1.LogLevels.INFO) {
            this.instance(args);
        }
    }
    debug(...args) {
        if (this.enabled && this.level >= logger_types_1.LogLevels.DEBUG) {
            this.instance(args);
        }
    }
    warn(...args) {
        if (this.enabled && this.level >= logger_types_1.LogLevels.WARN) {
            this.instance(args);
        }
    }
    error(...args) {
        if (this.enabled && this.level >= logger_types_1.LogLevels.ERROR) {
            this.instance(args);
        }
    }
    fatal(...args) {
        if (this.enabled && this.level >= logger_types_1.LogLevels.FATAL) {
            this.instance(args);
        }
    }
}
exports.default = LoggerService;
//# sourceMappingURL=LoggerService.js.map