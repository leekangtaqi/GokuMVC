"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ParamMetadata_1 = require("./metadata/ParamMetadata");
class ParamHandler {
    constructor(framework) {
        this.framework = framework;
    }
    handleParam(...args) {
        let req = args[0];
        let res = args[1];
        let param = args[2];
        let ctx = null;
        !param && (ctx = req) && (req = ctx.req) && (res = ctx.res) && (param = args[1]);
        var value;
        switch (param.type) {
            case ParamMetadata_1.ParamType.REQ:
                value = req;
                break;
            case ParamMetadata_1.ParamType.RES:
                value = res;
            default:
                value = this.framework.getParamFromRequest(ctx ? ctx : req, param.name, param.type);
                if (value) {
                    value = this.handleParamFormat(value, param);
                }
                break;
        }
        return value;
    }
    handleParamFormat(value, param) {
        const format = param.format;
        const formatName = format instanceof Function && format.name ? format.name : format instanceof String ? format : '';
        switch (formatName.toLowerCase()) {
            case 'number':
                return +value;
            case 'string':
                return value;
            case 'boolean':
                return !!value;
            default:
                if (value && param.parseJson) {
                    value = this.parseValueToJson(value, param);
                }
        }
        return value;
    }
    parseValueToJson(value, param) {
        try {
            const result = JSON.parse(value);
            if (param.format) {
                Object.assign(new (param.format()), result);
            }
            else {
                return result;
            }
        }
        catch (e) {
            throw new Error('parseValue to json failed');
        }
    }
}
exports.ParamHandler = ParamHandler;
//# sourceMappingURL=ParamHandler.js.map