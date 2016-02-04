"use strict";
class MetadataStorage {
    constructor() {
        this._controllerMetadatas = [];
        this._actionMetadatas = [];
        this._middlewareMetadatas = [];
        this._paramMetadatas = [];
        this._responsePropertyMetadatas = [];
    }
    get controllerMetadatas() {
        return this._controllerMetadatas;
    }
    get actionMetadata() {
        return this._actionMetadatas;
    }
    get middlewareMetadata() {
        return this._middlewareMetadatas;
    }
    get paramMetadata() {
        return this._paramMetadatas;
    }
    get responsePropertyMetadatas() {
        return this._responsePropertyMetadatas;
    }
    addControllerMetadata(controllerMetadata) {
        this._controllerMetadatas.push(controllerMetadata);
        return this;
    }
    addActionMetadata(actionMetadata) {
        this._actionMetadatas.push(actionMetadata);
        return this;
    }
    addMiddlewareMetadata(middlewareMetadata) {
        this._middlewareMetadatas.push(middlewareMetadata);
        return this;
    }
    addParamMetadata(paramMetadata) {
        this._paramMetadatas.push(paramMetadata);
        return this;
    }
    addResponsePropertyMetadata(responsePropertyMetadata) {
        this._responsePropertyMetadatas.push(responsePropertyMetadata);
        return this;
    }
    findResponsePropertyMetadataForControllerAndActionMetadata(ctrl, action) {
        return this._responsePropertyMetadatas.filter(responsePropertyMetadata => responsePropertyMetadata.object.constructor === ctrl.object && responsePropertyMetadata.method === action.method);
    }
    findParamMetadatasFromControllerMetadataAndActionMetadata(controllerMetadata, actionMetadata) {
        return this._paramMetadatas.filter(paramMetadata => this._actionMetadatas.filter(actionMetadata => paramMetadata.object.constructor === actionMetadata.object.constructor && paramMetadata.object.constructor === controllerMetadata.object).length >= 0);
    }
    findMiddlewareMetadatasFromControllerMetadata(controllerMetadata) {
        return this._middlewareMetadatas.filter(middlewareMetadata => middlewareMetadata.object.constructor === controllerMetadata.object);
    }
    findContollerMetadatasForClasses(ctrlClasses) {
        return this._controllerMetadatas.filter(ctrl => ctrlClasses.filter(cls => ctrl.object === cls).length >= 0);
    }
    findActionMetadatasForControllerMetadata(controllerMetadata) {
        return this._actionMetadatas.filter(action => action.object.constructor === controllerMetadata.object);
    }
}
exports.defaultMetadataStorage = new MetadataStorage();
