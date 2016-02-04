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
var MetadataStorage_1 = require('./metadata/MetadataStorage');
var ControllerMetadata_1 = require('./metadata/ControllerMetadata');
var ResponsePropertyMetadata_1 = require('./metadata/ResponsePropertyMetadata');
var ParamHandler_1 = require('./ParamHandler');
class DispatcherRunner {
    constructor(framework) {
        this.framework = framework;
        this._metadataStorage = MetadataStorage_1.defaultMetadataStorage;
        this.requireAll = require('require-all');
        this._paramHandler = new ParamHandler_1.ParamHandler(framework);
    }
    registerAllActions() {
        console.log(this._metadataStorage);
        this.registerControllerActions(this._metadataStorage.controllerMetadatas);
    }
    loadFiles(dir, excludeFiles, recursive) {
        this.requireAll({ dirname: dir, filter: null, excludeDirs: null, recursive: recursive });
    }
    registerControllerActions(controllerMetadatas) {
        controllerMetadatas.forEach(ctrl => {
            this._metadataStorage.findActionMetadatasForControllerMetadata(ctrl)
                .forEach(action => {
                const middlewares = this._metadataStorage.findMiddlewareMetadatasFromControllerMetadata(ctrl);
                const params = this._metadataStorage.findParamMetadatasFromControllerMetadataAndActionMetadata(ctrl, action);
                const propertyMetadata = this._metadataStorage.findResponsePropertyMetadataForControllerAndActionMetadata(ctrl, action);
                this.registerAction(ctrl, action, propertyMetadata, middlewares, params);
            });
        });
    }
    set container(value) {
        this._container = value;
    }
    set isLogErrorEnable(boolean) {
        this._isLogErrorEnable = boolean;
    }
    registerAction(controller, action, properties, middlewares, params) {
        var path = this.composePath(controller, action);
        controller.router = this.framework.getRouter();
        this.framework.registerAction(controller.router, path, action.type, (request, response) => this.handle(request, response, controller, action, properties, params));
    }
    composePath(controllerMetadata, actionMetadata) {
        var path = '';
        path += controllerMetadata.route ? controllerMetadata.route : '';
        path += actionMetadata.route ? actionMetadata.route : '';
        return path;
    }
    handle(req, res, controllerMetadata, actionMetadata, properties, paramMetadatas) {
        return __awaiter(this, void 0, Promise, function* () {
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
                const params = paramMetadatas
                    .sort((param1, param2) => param1.index - param2.index)
                    .map((paramMetadata) => this._paramHandler.handleParam(req, res, paramMetadata));
                const result = yield controllerObject[actionMetadata.method].apply(controllerObject, params);
                this.handleSuccess(result, resultOptions);
            }
            catch (e) {
                this.handleError(e, resultOptions);
            }
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
