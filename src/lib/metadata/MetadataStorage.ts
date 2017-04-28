"use strict";
import {ControllerMetadata} from './ControllerMetadata';
import {ActionMetadata} from './ActionMetadata';
import {MiddlewareMetadata} from './MiddlewareMetadata';
import {ParamMetadata} from './ParamMetadata';
import {ResponsePropertyMetadata} from './ResponsePropertyMetadata';

class MetadataStorage{
    private _controllerMetadatas: ControllerMetadata[] = [];
    private _actionMetadatas: ActionMetadata[] = [];
    private _middlewareMetadatas: MiddlewareMetadata[] = [];
    private _paramMetadatas: ParamMetadata[] = [];
    private _responsePropertyMetadatas: ResponsePropertyMetadata[] = [];
    
    get controllerMetadatas(): ControllerMetadata[]{
        return this._controllerMetadatas;
    }
    get actionMetadata(): ActionMetadata[]{
        return this._actionMetadatas;
    }
    get middlewareMetadata(): MiddlewareMetadata[]{
        return this._middlewareMetadatas;
    }
    get paramMetadata(): ParamMetadata[]{
        return this._paramMetadatas;
    }
    
    get responsePropertyMetadatas(): ResponsePropertyMetadata[]{
        return this._responsePropertyMetadatas;
    }
    
    addControllerMetadata(controllerMetadata: ControllerMetadata): MetadataStorage{
        this._controllerMetadatas.push(controllerMetadata);
        return this;
    }
    addActionMetadata(actionMetadata: ActionMetadata){
        this._actionMetadatas.push(actionMetadata);
        return this;
    }
    addMiddlewareMetadata(middlewareMetadata: MiddlewareMetadata){
        this._middlewareMetadatas.push(middlewareMetadata);
        return this;
    }
    addParamMetadata(paramMetadata: ParamMetadata){
        this._paramMetadatas.push(paramMetadata);
        return this;
    }
    addResponsePropertyMetadata(responsePropertyMetadata: ResponsePropertyMetadata){
        this._responsePropertyMetadatas.push(responsePropertyMetadata);
        return this;
    }
    findResponsePropertyMetadataForControllerAndActionMetadata(ctrl: ControllerMetadata, action: ActionMetadata){
        return this._responsePropertyMetadatas.filter(responsePropertyMetadata => 
            responsePropertyMetadata.object.constructor === ctrl.object && responsePropertyMetadata.method === action.method
        )
    }
    findParamMetadatasFromControllerMetadataAndActionMetadata(controllerMetadata: ControllerMetadata, actionMetadata: ActionMetadata): ParamMetadata[]{
        return this._paramMetadatas.filter(paramMetadata => 
            this._actionMetadatas.filter(actionMetadata => 
                paramMetadata.object.constructor === actionMetadata.object.constructor && paramMetadata.object.constructor === controllerMetadata.object
            ).length >= 0
        )
    }
    findMiddlewareMetadatasFromControllerMetadata(controllerMetadata: ControllerMetadata){
        return this._middlewareMetadatas.filter(middlewareMetadata=>
            middlewareMetadata.object.constructor === controllerMetadata.object
        )
    }

    findContollerMetadatasForClasses(ctrlClasses: Function[]): ControllerMetadata[]{
        return this._controllerMetadatas.filter(ctrl => 
            ctrlClasses.filter(
                cls => ctrl.object === cls).length >= 0);
    }
    findActionMetadatasForControllerMetadata(controllerMetadata: ControllerMetadata): ActionMetadata[]{
        return this._actionMetadatas.filter(action=>
            action.object.constructor === controllerMetadata.object)
    }
}
export var defaultMetadataStorage = new MetadataStorage()