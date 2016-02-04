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
require("reflect-metadata");
var ActionMetadata_1 = require('./metadata/ActionMetadata');
var ParamMetadata_1 = require('./metadata/ParamMetadata');
var MetadataStorage_1 = require('./metadata/MetadataStorage');
var ControllerMetadata_1 = require('./metadata/ControllerMetadata');
var ResponsePropertyMetadata_1 = require('./metadata/ResponsePropertyMetadata');
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
function Middeware() {
    return function (object, methodName) {
        MetadataStorage_1.defaultMetadataStorage.addMiddlewareMetadata({
            object: object,
            method: methodName
        });
    };
}
exports.Middeware = Middeware;
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
