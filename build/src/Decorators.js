"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const ActionMetadata_1 = require("./metadata/ActionMetadata");
const ParamMetadata_1 = require("./metadata/ParamMetadata");
const MetadataStorage_1 = require("./metadata/MetadataStorage");
const ControllerMetadata_1 = require("./metadata/ControllerMetadata");
const ResponsePropertyMetadata_1 = require("./metadata/ResponsePropertyMetadata");
const UsesMetadata_1 = require("./metadata/UsesMetadata");
function Mount(baseRoute, object) {
    return function (target, name, descriptor) {
        MetadataStorage_1.defaultMetadataStorage.addSubControllerMetadata({
            route: baseRoute,
            object: object,
            type: ControllerMetadata_1.ControllerType.Default,
            parent: target
        });
    };
}
exports.Mount = Mount;
function Domain() {
    return function (object) {
        MetadataStorage_1.defaultMetadataStorage.addModelMetadata({
            object
        });
    };
}
exports.Domain = Domain;
function Service(namespace) {
    return function (object) {
        MetadataStorage_1.defaultMetadataStorage.addServiceMetadata({
            namespace,
            object
        });
    };
}
exports.Service = Service;
function Controller(baseRoute) {
    return function (object) {
        MetadataStorage_1.defaultMetadataStorage.addControllerMetadata({
            route: baseRoute,
            object: object,
            type: ControllerMetadata_1.ControllerType.Default
        });
    };
}
exports.Controller = Controller;
function GlobalMiddleware() {
    return function (object, methodName) {
        MetadataStorage_1.defaultMetadataStorage.addMiddlewareMetadata({
            object: object,
            isGlobal: true
        });
    };
}
exports.GlobalMiddleware = GlobalMiddleware;
function Middleware() {
    return function (object) {
        MetadataStorage_1.defaultMetadataStorage.addMiddlewareMetadata({
            object: object,
            isGlobal: false,
            instance: object.prototype.use
        });
    };
}
exports.Middleware = Middleware;
function UseAfter(middlewares) {
    return function (object, methodName) {
        MetadataStorage_1.defaultMetadataStorage.addUseMetadata({
            object,
            methodName,
            type: UsesMetadata_1.UsesType.AFTER,
            middlewares
        });
    };
}
exports.UseAfter = UseAfter;
function UseBefore(middlewares) {
    return function (object, methodName) {
        MetadataStorage_1.defaultMetadataStorage.addUseMetadata({
            object,
            methodName,
            type: UsesMetadata_1.UsesType.BEFORE,
            middlewares
        });
    };
}
exports.UseBefore = UseBefore;
function Use(route, options) {
    return function (object, methodName) {
        MetadataStorage_1.defaultMetadataStorage.addActionMetadata({
            route: route,
            object: object,
            method: methodName,
            options: options,
            type: ActionMetadata_1.ActionType.USE
        });
    };
}
exports.Use = Use;
function Params(param) {
    return function (object, methodName) {
        MetadataStorage_1.defaultMetadataStorage.addParamsMetadata({
            object: object,
            method: methodName,
            param: param
        });
    };
}
exports.Params = Params;
function Get(route, options) {
    return function (object, methodName) {
        MetadataStorage_1.defaultMetadataStorage.addActionMetadata({
            route: route,
            object: object,
            method: methodName,
            options: options,
            type: ActionMetadata_1.ActionType.GET
        });
    };
}
exports.Get = Get;
function Post(route, options) {
    return function (object, methodName) {
        MetadataStorage_1.defaultMetadataStorage.addActionMetadata({
            route: route,
            object: object,
            method: methodName,
            options: options,
            type: ActionMetadata_1.ActionType.POST
        });
    };
}
exports.Post = Post;
function Put(route, options) {
    return function (object, methodName) {
        MetadataStorage_1.defaultMetadataStorage.addActionMetadata({
            route: route,
            object: object,
            method: methodName,
            options: options,
            type: ActionMetadata_1.ActionType.PUT
        });
    };
}
exports.Put = Put;
function DELETE(route, options) {
    return function (object, methodName) {
        MetadataStorage_1.defaultMetadataStorage.addActionMetadata({
            route: route,
            object: object,
            method: methodName,
            options: options,
            type: ActionMetadata_1.ActionType.DELETE
        });
    };
}
exports.DELETE = DELETE;
function Req() {
    return function (object, methodName, index) {
        MetadataStorage_1.defaultMetadataStorage.addParamMetadata({
            object: object,
            method: methodName,
            index: index,
            type: ParamMetadata_1.ParamType.REQ,
            isRequired: false,
            parseJson: false
        });
    };
}
exports.Req = Req;
function Res() {
    return function (object, methodName, index) {
        MetadataStorage_1.defaultMetadataStorage.addParamMetadata({
            object: object,
            method: methodName,
            index: index,
            type: ParamMetadata_1.ParamType.RES,
            isRequired: false,
            parseJson: false
        });
    };
}
exports.Res = Res;
function Param(name, isRequired, parseJson) {
    return function (object, methodName, index) {
        let format = Reflect.getMetadata('design:paramtypes', object, methodName)[index];
        MetadataStorage_1.defaultMetadataStorage.addParamMetadata({
            object: object,
            method: methodName,
            index: index,
            format: format,
            name: name,
            type: ParamMetadata_1.ParamType.PARAM,
            isRequired: isRequired,
            parseJson: parseJson
        });
    };
}
exports.Param = Param;
function Body(isRequired, parseJson) {
    return function (object, methodName, index) {
        let format = Reflect.getMetadata('design:paramtypes', object, methodName)[index];
        MetadataStorage_1.defaultMetadataStorage.addParamMetadata({
            object: object,
            method: methodName,
            index: index,
            format: format,
            type: ParamMetadata_1.ParamType.BODY,
            isRequired: isRequired,
            parseJson: parseJson
        });
    };
}
exports.Body = Body;
function Render(template) {
    return function (object, methodName) {
        MetadataStorage_1.defaultMetadataStorage.addResponsePropertyMetadata({
            value: template,
            object: object,
            method: methodName,
            type: ResponsePropertyMetadata_1.ResponsePropertyType.RENDERED_TEMPLATE
        });
    };
}
exports.Render = Render;
function Redirect(url) {
    return function (object, methodName) {
        MetadataStorage_1.defaultMetadataStorage.addResponsePropertyMetadata({
            value: url,
            object: object,
            method: methodName,
            type: ResponsePropertyMetadata_1.ResponsePropertyType.REDIRECT
        });
    };
}
exports.Redirect = Redirect;
//# sourceMappingURL=Decorators.js.map