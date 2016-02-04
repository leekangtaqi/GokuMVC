"use strict";
import "reflect-metadata";
import {ActionOptions, ActionType} from './metadata/ActionMetadata';
import {ParamType} from './metadata/ParamMetadata';
import {defaultMetadataStorage} from './metadata/MetadataStorage';
import {ControllerType} from './metadata/ControllerMetadata';
import {ResponsePropertyType} from './metadata/ResponsePropertyMetadata';


export function Controller(baseRoute?: string){
    return function(object: Function){
        defaultMetadataStorage.addControllerMetadata({
            route: baseRoute,
            object: object,
            type: ControllerType.Default
        })
    }
}
export function Middeware(){
    return function(object: Object, methodName: string){
        defaultMetadataStorage.addMiddlewareMetadata({
            object: object,
            method: methodName
        })
    }
}
export function Get(route?: RegExp, options?: ActionOptions): Function;
export function Get(route?: string, options?: ActionOptions): Function;
export function Get(route?: RegExp|string, options?: ActionOptions): Function{
    return function(object: Object, methodName: string){
        defaultMetadataStorage.addActionMetadata({
            route: route,
            object: object,
            method: methodName,
            options: options,
            type: ActionType.GET
        })
    }
}
export function Req(){
    return function(object: Object, methodName: string, index: number){
        defaultMetadataStorage.addParamMetadata({
            object: object,
            method: methodName,
            index: index,
            type: ParamType.REQ,
            isRequired: false,
            parseJson: false
        })    
    }
}
export function Res(){
    return function(object: Object, methodName: string, index: number){
        defaultMetadataStorage.addParamMetadata({
            object: object,
            method: methodName,
            index: index,
            type: ParamType.RES,
            isRequired: false,
            parseJson: false
        })    
    }
}
export function Param(name, isRequired?: boolean, parseJson?: boolean){
        return function(object: Object, methodName: string, index: number){
        let format = Reflect.getMetadata('design:paramtypes', object, methodName)[index];
        defaultMetadataStorage.addParamMetadata({
            object: object,
            method: methodName,
            index: index,
            format: format,
            name: name,
            type: ParamType.PARAM,
            isRequired: isRequired,
            parseJson: parseJson
        })    
    }
}
export function Body(isRequired?: boolean, parseJson?: boolean){
        return function(object: Object, methodName: string, index: number){
        let format = Reflect.getMetadata('design:paramtypes', object, methodName)[index];
        defaultMetadataStorage.addParamMetadata({
            object: object,
            method: methodName,
            index: index,
            format: format,
            type: ParamType.BODY,
            isRequired: isRequired,
            parseJson: parseJson
        })    
    }
}
export function Render(template: string){
    return function (object: Object, methodName: string) {
        defaultMetadataStorage.addResponsePropertyMetadata({
            value: template,
            object: object,
            method: methodName,
            type: ResponsePropertyType.RENDERED_TEMPLATE
        });
    }
}
export function Redirect(url: string){
    return function (object: Object, methodName: string) {
        defaultMetadataStorage.addResponsePropertyMetadata({
            value: url,
            object: object,
            method: methodName,
            type: ResponsePropertyType.REDIRECT
        });
    }
}