"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("koa-router");
const ParamMetadata_1 = require("../metadata/ParamMetadata");
const context_1 = require("../context");
const middleware_1 = require("../middleware");
class KoaServer {
    constructor(koa) {
        this.koa = koa;
        this.routerPrefixMap = new Map();
        this.rootRouters = new Set();
        this.actionMiddlewareMap = new Map();
        this.routerMiddlewareMap = new Map();
        this.routerParentMap = new Map();
        this.mountQueue = [];
        this.ctx = this.koa.ctx = new context_1.default();
    }
    getRouter(prefix) {
        if (prefix) {
            return new Router({ prefix });
        }
        return new Router();
    }
    routes() {
        this.execQueue();
        for (let r of this.rootRouters) {
            this.koa
                .use(r.routes())
                .use(r.allowedMethods());
        }
    }
    registerAction(root, router, route, actionType, executeCallback, isNew, isComplete, beforeControllerMiddlewares, afterControllerMiddlewares, beforeActionMiddlewares, afterActionMiddlewares) {
        actionType = actionType.toLowerCase();
        if (!router[actionType]) {
            throw new Error('Koa Router does not have such action ' + actionType);
        }
        if (isNew && beforeControllerMiddlewares && beforeControllerMiddlewares.length) {
            beforeControllerMiddlewares.forEach(m => router.use(m));
        }
        let args = [route];
        if (beforeActionMiddlewares && beforeActionMiddlewares.length) {
            args = [...args, ...beforeActionMiddlewares];
        }
        args.push((ctx, next) => executeCallback(ctx.request, ctx.response, ctx, next));
        if (afterActionMiddlewares && afterActionMiddlewares.length) {
            afterActionMiddlewares.forEach(m => {
                let key = actionType.toUpperCase() + route;
                let middlewares = this.actionMiddlewareMap.get(key);
                if (!middlewares || !middlewares.length) {
                    this.actionMiddlewareMap.set(key, [m]);
                }
                else {
                    this.actionMiddlewareMap.set(key, [...middlewares, m]);
                }
            });
        }
        router[actionType].apply(router, args);
        if (isComplete && afterControllerMiddlewares && afterControllerMiddlewares.length) {
            afterControllerMiddlewares.forEach(m => {
                let middlewares = this.routerMiddlewareMap.get(router);
                if (!middlewares || !middlewares.length) {
                    this.routerMiddlewareMap.set(router, [m]);
                }
                else {
                    this.routerMiddlewareMap.set(router, [...middlewares, m]);
                }
            });
        }
        if (root && isComplete) {
            this.routerParentMap.set(router, root.router);
            if (root.router.opts.prefix) {
                this.routerPrefixMap.set(router, root.router.opts.prefix + root.prefix);
                this.enqueue(root.router, router, root.prefix);
            }
            else {
                this.enqueue(root.router, router, root.prefix);
            }
        }
        if (!root) {
            this.rootRouters.add(router);
        }
    }
    enqueue(to, from, prefix) {
        this.mountQueue.push({ to, from, prefix });
    }
    execQueue() {
        this.mountQueue.reverse();
        this.mountQueue.forEach(({ to, from, prefix }) => {
            let layersBefore = to.stack.map((l, i) => ({ path: l.path, i }));
            to.use(prefix, from.routes(), from.allowedMethods());
            let layersAfter = to.stack.map((l, i) => ({ path: l.path, i }));
            this.reorderLayers(layersBefore, layersAfter, to);
        });
    }
    reorderLayers(befores, afters, router) {
        let stack = router.stack;
        let adds = stack.slice(befores.length);
        for (let i = 0, len = befores.length; i < len; i++) {
            let b = befores[i];
            if (this.isConflict(b.path, afters[afters.length - 1].path)) {
                let prev = stack.slice(0, i);
                let suff = stack.slice(i, befores.length);
                router.stack = [...prev, ...adds, ...suff];
                break;
            }
        }
    }
    isConflict(target, source) {
        if (!target || !source) {
            return false;
        }
        let targetParts = target.split('/');
        let sourceParts = source.split('/');
        if (!targetParts ||
            !targetParts.length ||
            !sourceParts ||
            !sourceParts.length ||
            targetParts.length != sourceParts.length) {
            return false;
        }
        targetParts = targetParts.filter(p => p);
        sourceParts = sourceParts.filter(p => p);
        for (let i = 0, len = targetParts.length; i < len; i++) {
            if (targetParts[i] === sourceParts[i]) {
                continue;
            }
            else if (targetParts[i].startsWith(':')) {
                return true;
            }
            return false;
        }
        return false;
    }
    getParamFromRequest(request, paramName, paramType) {
        let val = null;
        switch (paramType) {
            case ParamMetadata_1.ParamType.BODY:
                val = request.body;
                break;
            case ParamMetadata_1.ParamType.PARAM:
                val = request.params[paramName];
                break;
            case ParamMetadata_1.ParamType.QUERY:
                val = request.query[paramName];
                break;
            case ParamMetadata_1.ParamType.COOKIE:
                val = request.cookies[paramName];
                break;
        }
        return val;
    }
    doChain(ctx, next, path, router) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let actionMiddlewares = this.actionMiddlewareMap.get(ctx.method + path);
                let controllerMiddlewares = this.getControllerMiddlewaresChain(router, []);
                let middlewares = [...actionMiddlewares || [], ...controllerMiddlewares || []];
                if (middlewares.length) {
                    yield middleware_1.compose(...middlewares)(ctx);
                }
            }
            catch (e) {
                throw e;
            }
        });
    }
    getControllerMiddlewaresChain(router, arr) {
        try {
            if (!router) {
                return arr;
            }
            let middlewares = this.routerMiddlewareMap.get(router);
            if (middlewares && middlewares.length) {
                arr = [...arr, ...middlewares];
            }
            let parent = this.routerParentMap.get(router);
            return this.getControllerMiddlewaresChain(parent, arr);
        }
        catch (e) {
            throw e;
        }
    }
    handleSuccess(options) {
        var context = options.context;
        if (options.successHttpCode) {
            context.status = 200;
        }
        this.handleResult(options);
    }
    handleError(options) {
        var context = options.context;
        if (options.errorHttpCode) {
            context.status = options.errorHttpCode;
        }
        this.handleResult(options);
    }
    handleResult(options) {
        var context = options.context;
        var response = context.response;
        if (options.content) {
            if (options.renderedTemplate) {
                console.error('render not supported now.');
            }
            else {
                if (options.redirect) {
                    context.redirect(options.redirect);
                }
                else if (options.asJson) {
                    context.body = options.content;
                }
                else {
                    context.body = options.content;
                }
            }
        }
    }
}
exports.KoaServer = KoaServer;
//# sourceMappingURL=KoaServer.js.map