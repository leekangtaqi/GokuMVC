"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MetadataStorage {
    constructor() {
        this._paramsMetadata = [];
        this._controllerMetadatas = [];
        this._serviceMetadatas = [];
        this._modelMetadatas = [];
        this._actionMetadatas = [];
        this._middlewareMetadatas = [];
        this._paramMetadatas = [];
        this._responsePropertyMetadatas = [];
        this._usesMetadatas = [];
    }
    get modelMetadatas() {
        return this._modelMetadatas;
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
    get serviceMetadatas() {
        return this._serviceMetadatas;
    }
    get responsePropertyMetadatas() {
        return this._responsePropertyMetadatas;
    }
    addModelMetadata(modelMetadata) {
        this._modelMetadatas.push(modelMetadata);
        return this;
    }
    addServiceMetadata(serviceMetadata) {
        this._serviceMetadatas.push(serviceMetadata);
        return this;
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
    addUseMetadata(usesMetadata) {
        this._usesMetadatas.push(usesMetadata);
        return this;
    }
    addParamsMetadata(paramsMetadata) {
        this._paramsMetadata.push(paramsMetadata);
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
        return this._controllerMetadatas.filter(ctrl => {
            return ctrlClasses.filter(cls => {
                return ctrl.object === cls;
            }).length > 0;
        });
    }
    findActionMetadatasForControllerMetadata(controllerMetadata) {
        return this._actionMetadatas.filter(action => action.object.constructor === controllerMetadata.object);
    }
    findUsesForControllerMetadata(controllerMetadata) {
        return this._usesMetadatas.filter(use => typeof use.methodName === 'undefined' && controllerMetadata.object.name === use.object.name);
    }
    findUsesForControllerMetadataAndActionMetadata(controllerMetadata, actionMetadata) {
        return this._usesMetadatas.filter(use => {
            return use.methodName
                && actionMetadata.method === use.methodName
                && controllerMetadata.object.name === use.object.constructor.name;
        });
    }
    addSubControllerMetadata(controllerMetadata) {
        this._controllerMetadatas.push(controllerMetadata);
        return this;
    }
}
exports.defaultMetadataStorage = new MetadataStorage();
//# sourceMappingURL=MetadataStorage.js.map