"use strict";
import {defaultMetadataStorage} from './metadata/MetadataStorage';
import {ControllerMetadata, ControllerType} from './metadata/ControllerMetadata';
import {ActionMetadata, ActionOptions} from './metadata/ActionMetadata';
import {MiddlewareMetadata} from './metadata/MiddlewareMetadata';
import {ResponsePropertyMetadata, ResponsePropertyType} from './metadata/ResponsePropertyMetadata';
import {ParamMetadata} from './metadata/ParamMetadata';
import {Server} from './server/Server';
import {ParamHandler} from './ParamHandler';
import {ResultHandleOptions} from './ResultHandleOptions';

declare var require; 
export class DispatcherRunner{
    private _container;
    private _metadataStorage = defaultMetadataStorage;
    private _paramHandler: ParamHandler;
    private _isLogErrorEnable: boolean;
    private requireAll = require('require-all');
    
    constructor(private framework: Server){
        this._paramHandler = new ParamHandler(framework);
    }    
    registerAllActions(){
        console.log(this._metadataStorage);
        this.registerControllerActions(this._metadataStorage.controllerMetadatas);
    }
    loadFiles(dir: string, excludeFiles?: string[], recursive?: boolean){
        this.requireAll({ dirname: dir, filter: null, excludeDirs: null, recursive: recursive });
    }
    registerControllerActions(controllerMetadatas: ControllerMetadata[]){
        controllerMetadatas.forEach(ctrl=>{
            this._metadataStorage.findActionMetadatasForControllerMetadata(ctrl)
                .forEach(action=>{
                    const middlewares = this._metadataStorage.findMiddlewareMetadatasFromControllerMetadata(ctrl);
                    const params = this._metadataStorage.findParamMetadatasFromControllerMetadataAndActionMetadata(ctrl, action);
                    const propertyMetadata = this._metadataStorage.findResponsePropertyMetadataForControllerAndActionMetadata(ctrl, action);
                    this.registerAction(ctrl, action, propertyMetadata, middlewares, params);  
                })
        })
    }
    private set container(value: any){
        this._container = value;
    }
    private set isLogErrorEnable(boolean){
        this._isLogErrorEnable = boolean;
    }
    private registerAction(controller: ControllerMetadata, action: ActionMetadata, properties: ResponsePropertyMetadata[], middlewares?: MiddlewareMetadata[], params?: ParamMetadata[]){
        var path = this.composePath(controller, action);
        controller.router = this.framework.getRouter();
        this.framework.registerAction(controller.router, path, action.type, (request, response)=> this.handle(request, response, controller, action, properties, params));
    }
    private composePath(controllerMetadata: ControllerMetadata, actionMetadata: ActionMetadata){
        var path = '';
        path += controllerMetadata.route ?  controllerMetadata.route : '';
        path += actionMetadata.route ? actionMetadata.route : '';
        return path;
    }
    private async handle(req: any, 
                   res: any,
                   controllerMetadata: ControllerMetadata,
                   actionMetadata: ActionMetadata,
                   properties: ResponsePropertyMetadata[],
                   paramMetadatas: ParamMetadata[]
                   )
    {
        const isJson = this.isActionMustReturnJson(controllerMetadata.type, actionMetadata.options);
        const controllerObject = this.getControllerInstance(controllerMetadata);
        const contentTypeMetadata = properties.reduce((prev, curr)=>
            curr.type === ResponsePropertyType.CONTENT_TYPE ? curr: prev
        , undefined);
        const successHttpCodeMetadata = properties.reduce((prev, curr)=>
            curr.type === ResponsePropertyType.SUCCESS_CODE ? curr: prev
        , undefined);
        const errorHttpCodeMetadata = properties.reduce((prev, curr)=>
            curr.type === ResponsePropertyType.ERROR_CODE ? curr: prev
        , undefined);
        const redirectMetadata = properties.reduce((prev, curr)=>
            curr.type === ResponsePropertyType.REDIRECT ? curr: prev
        , undefined);
        const renderMetadata = properties.reduce((prev, curr)=>
            curr.type === ResponsePropertyType.RENDERED_TEMPLATE ? curr: prev
        , undefined);
        const headerMetadatas = properties.filter((property)=>
            property.type === ResponsePropertyType.HEADER
        ).map((headerMetadata)=>({ name:  headerMetadata.value, value: headerMetadata.value2}))
        var resultOptions: ResultHandleOptions= {
            request: req,
            response: res,
            content: undefined,
            asJson: isJson,
            headers: headerMetadatas,
            redirect: redirectMetadata ? redirectMetadata.value: undefined,
            renderedTemplate: renderMetadata ? renderMetadata.value: undefined,
            errorHttpCode: errorHttpCodeMetadata ? errorHttpCodeMetadata.value: undefined,
            successHttpCode: successHttpCodeMetadata ? successHttpCodeMetadata.value: undefined,
        }
        if(contentTypeMetadata && contentTypeMetadata.value){
            resultOptions.headers.push({name: 'Content-Type', value: contentTypeMetadata.value})
        }
        try{
            const params = paramMetadatas
                                .sort((param1, param2) => param1.index - param2.index)
                                .map((paramMetadata)=>this._paramHandler.handleParam(req, res, paramMetadata));      
            const result = await controllerObject[actionMetadata.method].apply(controllerObject, params);
            this.handleSuccess(result, resultOptions);
        }catch(e){
            this.handleError(e, resultOptions);    
        }
    }
    private isActionMustReturnJson(controllerType: ControllerType, actionOption: ActionOptions): boolean{
        if(actionOption && actionOption.jsonResponse){
            return true;
        }
        if(controllerType === ControllerType.Json && actionOption && actionOption.textResponse){
            return false;
        }
        return controllerType === ControllerType.Json;
    }
    private getControllerInstance(metadata: ControllerMetadata){
        if(this._container){
            return this._container.get(metadata.object.name);
        }
        if(!metadata.instance){
            metadata.instance = new (<any>metadata.object)()    
        }
        return metadata.instance;
    }
    private handleSuccess(value: any, resultOptions: ResultHandleOptions){
        resultOptions.content = value;
        this.framework.handleSuccess(resultOptions);
    }
    private handleError(e: Error, resultOptions: ResultHandleOptions){
        if(this._isLogErrorEnable){
            console.error(e.stack ? e.stack : e);
        }
        resultOptions.content = e;
        this.framework.handleError(resultOptions);
    };
}