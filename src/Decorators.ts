"use strict";
import "reflect-metadata";
import { ActionOptions, ActionType } from './metadata/ActionMetadata';
import { ParamType } from './metadata/ParamMetadata';
import { defaultMetadataStorage } from './metadata/MetadataStorage';
import { ControllerType } from './metadata/ControllerMetadata';
import { ResponsePropertyType } from './metadata/ResponsePropertyMetadata';
import { Model } from 'mongoose';
import { UsesType } from './metadata/UsesMetadata';

export function Mount(baseRoute: string, object: any): any {
  return function (target, name, descriptor) {
    defaultMetadataStorage.addSubControllerMetadata(
      {
        route: baseRoute,
        object: object,
        type: ControllerType.Default,
        parent: target
      }
    )
  }
}

export function Domain() {
  return function (object: any) {
    defaultMetadataStorage.addModelMetadata({
      object
    })
  }
}
export function Service(namespace?: string) {
  return function (object: Function) {
    defaultMetadataStorage.addServiceMetadata({
      namespace,
      object
    })
  }
}
export function Controller(baseRoute?: string) {
  return function (object: Function) {
    defaultMetadataStorage.addControllerMetadata({
      route: baseRoute,
      object: object,
      type: ControllerType.Default
    })
  }
}
export function GlobalMiddleware() {
  return function (object: Object, methodName: string) {
    defaultMetadataStorage.addMiddlewareMetadata({
      object: object,
      isGlobal: true
    })
  }
}
export function Middleware() {
  return function (object: any) {
    defaultMetadataStorage.addMiddlewareMetadata({
      object: object,
      isGlobal: false,
      instance: object.prototype.use
    })
  }
}

export function UseAfter(middlewares: Function[]): Function;
export function UseAfter(middlewares: any[]): Function {
  return function (object: any, methodName?: string) {
    defaultMetadataStorage.addUseMetadata({
      object,
      methodName,
      type: UsesType.AFTER,
      middlewares
    })
  }
}

export function UseBefore(middlewares: Function[]): Function;
export function UseBefore(middlewares: any[]): Function {
  return function (object: any, methodName?: string) {
    defaultMetadataStorage.addUseMetadata({
      object,
      methodName,
      type: UsesType.BEFORE,
      middlewares
    })
  }
}

export function Use(route?: RegExp, options?: ActionOptions): Function;
export function Use(route?: string, options?: ActionOptions): Function;
export function Use(route?: RegExp | string, options?: ActionOptions): Function {
  return function (object: Object, methodName: string) {
    defaultMetadataStorage.addActionMetadata({
      route: route,
      object: object,
      method: methodName,
      options: options,
      type: ActionType.USE
    })
  }
}

export function Params(param) {
  return function (object: Object, methodName: string) {
    defaultMetadataStorage.addParamsMetadata({
      object: object,
      method: methodName,
      param: param
    })
  }
}

export function Get(route?: RegExp, options?: ActionOptions): Function;
export function Get(route?: string, options?: ActionOptions): Function;
export function Get(route?: RegExp | string, options?: ActionOptions): Function {
  return function (object: Object, methodName: string) {
    defaultMetadataStorage.addActionMetadata({
      route: route,
      object: object,
      method: methodName,
      options: options,
      type: ActionType.GET
    })
  }
}
export function Post(route?: RegExp, options?: ActionOptions): Function;
export function Post(route?: string, options?: ActionOptions): Function;
export function Post(route?: RegExp | string, options?: ActionOptions): Function {
  return function (object: Object, methodName: string) {
    defaultMetadataStorage.addActionMetadata({
      route: route,
      object: object,
      method: methodName,
      options: options,
      type: ActionType.POST
    })
  }
}
export function Put(route?: RegExp, options?: ActionOptions): Function;
export function Put(route?: string, options?: ActionOptions): Function;
export function Put(route?: RegExp | string, options?: ActionOptions): Function {
  return function (object: Object, methodName: string) {
    defaultMetadataStorage.addActionMetadata({
      route: route,
      object: object,
      method: methodName,
      options: options,
      type: ActionType.PUT
    })
  }
}
export function DELETE(route?: RegExp, options?: ActionOptions): Function;
export function DELETE(route?: string, options?: ActionOptions): Function;
export function DELETE(route?: RegExp | string, options?: ActionOptions): Function {
  return function (object: Object, methodName: string) {
    defaultMetadataStorage.addActionMetadata({
      route: route,
      object: object,
      method: methodName,
      options: options,
      type: ActionType.DELETE
    })
  }
}
export function Req() {
  return function (object: Object, methodName: string, index: number) {
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
export function Res() {
  return function (object: Object, methodName: string, index: number) {
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
export function Param(name?: string, isRequired?: boolean, parseJson?: boolean) {
  return function (object: Object, methodName: string, index: number) {
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
export function Body(isRequired?: boolean, parseJson?: boolean) {
  return function (object: Object, methodName: string, index: number) {
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
export function Render(template: string) {
  return function (object: Object, methodName: string) {
    defaultMetadataStorage.addResponsePropertyMetadata({
      value: template,
      object: object,
      method: methodName,
      type: ResponsePropertyType.RENDERED_TEMPLATE
    });
  }
}
export function Redirect(url: string) {
  return function (object: Object, methodName: string) {
    defaultMetadataStorage.addResponsePropertyMetadata({
      value: url,
      object: object,
      method: methodName,
      type: ResponsePropertyType.REDIRECT
    });
  }
}