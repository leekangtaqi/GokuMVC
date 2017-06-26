"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_base_1 = require("./config.base");
const properties_1 = require("../properties");
const _ = require("lodash");
let env = process.env;
let suffix = env === properties_1.default.env.QA ? 'qa' : env === properties_1.default.env.PRD ? 'prd' : 'dev';
let toMergeCfg = require(`./config.${suffix}.ts`).default;
class Config {
    constructor(config) {
        this.port = config.port;
        this.mongo = config.mongo;
    }
}
exports.default = new Config(_.merge({}, config_base_1.default, toMergeCfg));
//# sourceMappingURL=index.js.map