"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, Promise, generator) {
    return new Promise(function (resolve, reject) {
        generator = generator.call(thisArg, _arguments);
        function cast(value) { return value instanceof Promise && value.constructor === Promise ? value : new Promise(function (resolve) { resolve(value); }); }
        function onfulfill(value) { try { step("next", value); } catch (e) { reject(e); } }
        function onreject(value) { try { step("throw", value); } catch (e) { reject(e); } }
        function step(verb, value) {
            var result = generator[verb](value);
            result.done ? resolve(result.value) : cast(result.value).then(onfulfill, onreject);
        }
        step("next", void 0);
    });
};
var e = require('express');
var ParamMetadata_1 = require('../metadata/ParamMetadata');
class ExpressServer {
    constructor(express) {
        this.express = express;
    }
    getRouter() {
        return e.Router();
    }
    registerAction(router, route, actionType, executeCallback, middlewares) {
        middlewares && middlewares.forEach(fn => router.use(fn));
        actionType = actionType.toLowerCase();
        if (!router[actionType]) {
            throw new Error('Express Router does not have such action ' + actionType);
        }
        router[actionType](route, executeCallback);
        this.express.use(router);
    }
    getParamFromRequest(request, paramName, paramType) {
        switch (paramType) {
            case ParamMetadata_1.ParamType.BODY:
                return request.body;
            case ParamMetadata_1.ParamType.PARAM:
                return request.params[paramName];
            case ParamMetadata_1.ParamType.QUERY:
                return request.query[paramName];
            case ParamMetadata_1.ParamType.COOKIE:
                return request.cookies[paramName];
        }
    }
    handleSuccess(options) {
        var response = options.response;
        if (options.successHttpCode) {
            response.status(options.successHttpCode);
        }
        this.handleResult(options);
    }
    handleError(options) {
        var response = options.response;
        if (options.errorHttpCode) {
            response.status(options.errorHttpCode);
        }
        this.handleResult(options);
    }
    handleResult(options) {
        var response = options.response;
        if (options.headers) {
            options.headers.forEach((header) => response.header(header.name, header.value));
        }
        if (options.content) {
            if (options.renderedTemplate) {
                const result = options.content && options.content instanceof Object ? options.content : {};
                this.express.render(options.renderedTemplate, result, (err, html) => {
                    if (err && options.asJson) {
                        response.json(err);
                    }
                    else if (err && !options.asJson) {
                        response.send(err);
                    }
                    else if (html) {
                        response.send(html);
                    }
                    response.end();
                });
            }
            else {
                if (options.redirect) {
                    response.redirect(options.redirect);
                }
                else if (options.asJson) {
                    response.json(options.content);
                }
                else {
                    response.send(options.content);
                }
                response.end();
            }
        }
        else {
            response.end();
        }
    }
}
exports.ExpressServer = ExpressServer;
