"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const e = require("express");
const ParamMetadata_1 = require("../metadata/ParamMetadata");
class ExpressServer {
    constructor(express) {
        this.express = express;
    }
    getRouter() {
        return e.Router();
    }
    doChain() { }
    registerAction(root, router, route, actionType, executeCallback, isNew, isComplete, middlewares) {
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
//# sourceMappingURL=ExpressServer.js.map