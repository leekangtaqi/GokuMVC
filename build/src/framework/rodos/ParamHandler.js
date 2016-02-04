"use strict";
var ParamMetadata_1 = require('./metadata/ParamMetadata');
class ParamHandler {
    constructor(framework) {
        this.framework = framework;
    }
    handleParam(req, res, param) {
        var value;
        switch (param.type) {
            case ParamMetadata_1.ParamType.REQ:
                value = req;
                break;
            case ParamMetadata_1.ParamType.RES:
                value = res;
            default:
                value = this.framework.getParamFromRequest(req, param.name, param.type);
                if (value) {
                    value = this.handleParamFormat(value, param);
                }
                break;
        }
    }
    handleParamFormat(value, param) {
        const format = param.format;
        const formatName = format instanceof Function && format.name ? format.name : format instanceof String ? format : '';
        switch (formatName.toLowerCase()) {
            case 'number':
                return +value;
                break;
            case 'string':
                return value;
                break;
            case 'boolean':
                return !!value;
                break;
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
