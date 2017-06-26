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
const MetadataStorage_1 = require("./metadata/MetadataStorage");
const ControllerMetadata_1 = require("./metadata/ControllerMetadata");
const UsesMetadata_1 = require("./metadata/UsesMetadata");
const ResponsePropertyMetadata_1 = require("./metadata/ResponsePropertyMetadata");
const ParamHandler_1 = require("./ParamHandler");
const domainBuilder_1 = require("./domainBuilder");
class DispatcherRunner {
    constructor(framework, context) {
        this.framework = framework;
        this.context = context;
        this._metadataStorage = MetadataStorage_1.defaultMetadataStorage;
        this.requireAll = require('require-all');
        this._applicationContext = null;
        this._domainContext = null;
        this._domainBuilder = null;
        this._paramHandler = new ParamHandler_1.ParamHandler(framework);
        this._applicationContext = this.framework.ctx;
        this._domainContext = context;
        this._domainBuilder = new domainBuilder_1.default(this._applicationContext);
    }
    registerAllActions() {
        this.registerControllerActions(this._metadataStorage.controllerMetadatas);
    }
    loadFiles(dir, excludeFiles, recursive) {
        this.requireAll({ dirname: dir, recursive: true, filter: /(Controller|Service|Model|Middleware)\.ts/, });
    }
    registerControllerActions(controllerMetadatas) {
        controllerMetadatas.filter(ctrl => ctrl.route && !ctrl.parent).forEach(ctrl => {
            let ctrls = this._metadataStorage.findActionMetadatasForControllerMetadata(ctrl);
            ctrls.forEach((action, index) => {
                const middlewares = this._metadataStorage.findMiddlewareMetadatasFromControllerMetadata(ctrl);
                const params = this._metadataStorage.findParamMetadatasFromControllerMetadataAndActionMetadata(ctrl, action);
                const propertyMetadata = this._metadataStorage.findResponsePropertyMetadataForControllerAndActionMetadata(ctrl, action);
                this.registerAction(null, ctrl, action, propertyMetadata, index === 0, index === ctrls.length - 1, middlewares, params);
            });
        });
        this.bfsRegisterSubcontrollerActions(null, controllerMetadatas);
        this.framework.routes();
    }
    bfsRegisterSubcontrollerActions(root, controllerMetadatas) {
        let nodes = null;
        if (!root) {
            nodes = controllerMetadatas.filter(c => !c.parent);
        }
        else {
            nodes = controllerMetadatas.filter(c => c.parent && c.parent.constructor === root.object);
        }
        if (!nodes || !nodes.length) {
            return;
        }
        nodes.forEach(n => {
            if (!n.router) {
                this.registerSubActions(n);
            }
            this.bfsRegisterSubcontrollerActions(n, controllerMetadatas);
        });
    }
    registerSubActions(ctrl) {
        let [parent] = this._metadataStorage.controllerMetadatas.filter(c => c.object === ctrl.parent.constructor);
        let actions = this._metadataStorage.findActionMetadatasForControllerMetadata(ctrl);
        actions.forEach((action, index) => {
            const middlewares = this._metadataStorage.findMiddlewareMetadatasFromControllerMetadata(ctrl);
            const params = this._metadataStorage.findParamMetadatasFromControllerMetadataAndActionMetadata(ctrl, action);
            const propertyMetadata = this._metadataStorage.findResponsePropertyMetadataForControllerAndActionMetadata(ctrl, action);
            this.registerAction({ prefix: ctrl.route, router: parent.router }, ctrl, action, propertyMetadata, index === 0, index === actions.length - 1, middlewares, params);
        });
    }
    set container(value) {
        this._container = value;
    }
    set isLogErrorEnable(boolean) {
        this._isLogErrorEnable = boolean;
    }
    registerAction(root, controller, action, properties, isNew, isComplete, middlewares, params) {
        let path = action.route;
        let router = null;
        if (controller.router) {
            router = controller.router;
        }
        else if (controller.parent) {
            router = this.framework.getRouter();
        }
        else {
            router = this.framework.getRouter(controller.route);
        }
        controller.router = router;
        var args = [
            root,
            controller.router,
            path,
            action.type,
            (request, response, ctx, next) => __awaiter(this, void 0, void 0, function* () { return yield this.handle(request, response, controller, action, properties, params, path, ctx, next); })
        ];
        var usesForController = this._metadataStorage.findUsesForControllerMetadata(controller);
        var usesForAction = this._metadataStorage.findUsesForControllerMetadataAndActionMetadata(controller, action);
        let [beforeControllerMiddlewares, afterControllerMiddlewares, beforeActionMiddlewares, afterActionMiddlewares] = this.arrangeUses(usesForController, usesForAction);
        args = [...args,
            isNew,
            isComplete,
            beforeControllerMiddlewares || [],
            afterControllerMiddlewares || [],
            beforeActionMiddlewares,
            afterActionMiddlewares
        ];
        this.framework.registerAction.apply(this.framework, args);
    }
    arrangeUses(usesForControllerMetadata, usesForActionMetadata) {
        let res = [];
        let beforeControllerMiddlewares = [];
        let afterControllerMiddlewares = [];
        let beforeActionMiddlewares = [];
        let afterActionMiddlewares = [];
        if (usesForControllerMetadata && usesForControllerMetadata.length) {
            usesForControllerMetadata.map(u => {
                if (u.type === UsesMetadata_1.UsesType.BEFORE) {
                    beforeControllerMiddlewares = beforeControllerMiddlewares.concat(u.middlewares);
                }
                else {
                    afterControllerMiddlewares = afterControllerMiddlewares.concat(u.middlewares);
                }
            });
        }
        if (usesForActionMetadata && usesForActionMetadata.length) {
            usesForActionMetadata.map(u => {
                if (u.type === UsesMetadata_1.UsesType.BEFORE) {
                    beforeActionMiddlewares = beforeActionMiddlewares.concat(u.middlewares);
                }
                else {
                    afterActionMiddlewares = afterActionMiddlewares.concat(u.middlewares);
                }
            });
        }
        return [
            beforeControllerMiddlewares,
            afterControllerMiddlewares,
            beforeActionMiddlewares,
            afterActionMiddlewares
        ];
    }
    composePath(controllerMetadata, actionMetadata) {
        var path = '';
        if (!controllerMetadata.parent) {
            path += controllerMetadata.route ? controllerMetadata.route : '';
        }
        path += actionMetadata.route ? actionMetadata.route : '';
        return path;
    }
    handle(req, res, controllerMetadata, actionMetadata, properties, paramMetadatas, path, ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const isJson = this.isActionMustReturnJson(controllerMetadata.type, actionMetadata.options);
            const controllerObject = this.getControllerInstance(controllerMetadata);
            const contentTypeMetadata = properties.reduce((prev, curr) => curr.type === ResponsePropertyMetadata_1.ResponsePropertyType.CONTENT_TYPE ? curr : prev, undefined);
            const successHttpCodeMetadata = properties.reduce((prev, curr) => curr.type === ResponsePropertyMetadata_1.ResponsePropertyType.SUCCESS_CODE ? curr : prev, undefined);
            const errorHttpCodeMetadata = properties.reduce((prev, curr) => curr.type === ResponsePropertyMetadata_1.ResponsePropertyType.ERROR_CODE ? curr : prev, undefined);
            const redirectMetadata = properties.reduce((prev, curr) => curr.type === ResponsePropertyMetadata_1.ResponsePropertyType.REDIRECT ? curr : prev, undefined);
            const renderMetadata = properties.reduce((prev, curr) => curr.type === ResponsePropertyMetadata_1.ResponsePropertyType.RENDERED_TEMPLATE ? curr : prev, undefined);
            const headerMetadatas = properties.filter((property) => property.type === ResponsePropertyMetadata_1.ResponsePropertyType.HEADER).map((headerMetadata) => ({ name: headerMetadata.value, value: headerMetadata.value2 }));
            var resultOptions = {
                request: req,
                response: res,
                context: ctx,
                content: undefined,
                asJson: isJson,
                headers: headerMetadatas,
                redirect: redirectMetadata ? redirectMetadata.value : undefined,
                renderedTemplate: renderMetadata ? renderMetadata.value : undefined,
                errorHttpCode: errorHttpCodeMetadata ? errorHttpCodeMetadata.value : undefined,
                successHttpCode: successHttpCodeMetadata ? successHttpCodeMetadata.value : undefined,
            };
            if (contentTypeMetadata && contentTypeMetadata.value) {
                resultOptions.headers.push({ name: 'Content-Type', value: contentTypeMetadata.value });
            }
            try {
                const paramsTmp = paramMetadatas
                    .sort((param1, param2) => param1.index - param2.index);
                let params = null;
                if (!ctx) {
                    params = paramsTmp.map((paramMetadata) => this._paramHandler.handleParam(req, res, paramMetadata));
                }
                else {
                    params = paramsTmp.map((paramMetadata) => this._paramHandler.handleParam(ctx, paramMetadata));
                }
                let result = null;
                let args = params;
                if (ctx) {
                    if (!params
                        || !params.length
                        || params.filter(p => typeof p != 'undefined').length <= 0) {
                        args = [{ ctx, next }];
                    }
                    else {
                        args = [...params, { ctx, next }];
                    }
                }
                result = yield controllerObject[actionMetadata.method].apply(controllerObject, args);
                yield this.framework.doChain(ctx, next, path, controllerMetadata.router);
                this.handleSuccess(result, resultOptions);
            }
            catch (e) {
                this.handleError(e, resultOptions);
            }
        });
    }
    wireModules() {
        this.collectModelsToApplicationContext();
        this.collectServicesToApplicationContext();
        this.framework.ctx = this.applicationContext;
    }
    get applicationContext() {
        return this._applicationContext;
    }
    collectModelsToApplicationContext() {
        let models = this._metadataStorage.modelMetadatas;
        models.forEach(metadata => {
            this._domainBuilder.build(metadata);
        });
    }
    collectServicesToApplicationContext() {
        let services = this._metadataStorage.serviceMetadatas;
        services.forEach(metadata => {
            let serviceInst = new metadata.object(this.applicationContext);
            this.applicationContext.services[metadata.object.name] = serviceInst;
        });
    }
    isActionMustReturnJson(controllerType, actionOption) {
        if (actionOption && actionOption.jsonResponse) {
            return true;
        }
        if (controllerType === ControllerMetadata_1.ControllerType.Json && actionOption && actionOption.textResponse) {
            return false;
        }
        return controllerType === ControllerMetadata_1.ControllerType.Json;
    }
    getControllerInstance(metadata) {
        if (this._container) {
            return this._container.get(metadata.object.name);
        }
        if (!metadata.instance) {
            metadata.instance = new metadata.object();
        }
        return metadata.instance;
    }
    handleSuccess(value, resultOptions) {
        resultOptions.content = value;
        this.framework.handleSuccess(resultOptions);
    }
    handleError(e, resultOptions) {
        if (this._isLogErrorEnable) {
            console.error(e.stack ? e.stack : e);
        }
        resultOptions.content = e;
        this.framework.handleError(resultOptions);
    }
    ;
}
exports.DispatcherRunner = DispatcherRunner;
//# sourceMappingURL=DispatcherRunner.js.map