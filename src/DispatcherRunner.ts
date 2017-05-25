"use strict";
import { defaultMetadataStorage } from './metadata/MetadataStorage';
import { ControllerMetadata, ControllerType } from './metadata/ControllerMetadata';
import { ActionMetadata, ActionOptions } from './metadata/ActionMetadata';
import { MiddlewareMetadata } from './metadata/MiddlewareMetadata';
import { UsesMetadata, UsesType } from './metadata/UsesMetadata';
import { ResponsePropertyMetadata, ResponsePropertyType } from './metadata/ResponsePropertyMetadata';
import { ParamMetadata } from './metadata/ParamMetadata';
import { Server } from './server/Server';
import { ParamHandler } from './ParamHandler';
import { ResultHandleOptions } from './ResultHandleOptions';
import ApplicationContext, { IApplicationContext } from './context'
import { IDomainContext } from './domain';
import DomainBuilder from './domainBuilder';

export class DispatcherRunner {
  private _container: any;
  private _metadataStorage = defaultMetadataStorage;
  private _paramHandler: ParamHandler;
  private _isLogErrorEnable: boolean;
  private requireAll = require('require-all');
  private _applicationContext: IApplicationContext = null
  private _domainContext: IDomainContext = null
  private _domainBuilder: DomainBuilder = null

  constructor(private framework: Server, private context: IDomainContext) {
    this._paramHandler = new ParamHandler(framework);
    this._applicationContext = this.framework.ctx
    this._domainContext = context;
    this._domainBuilder = new DomainBuilder(this._applicationContext)
  }

  registerAllActions() {
    this.registerControllerActions(this._metadataStorage.controllerMetadatas);
  }

  loadFiles(dir: string, excludeFiles?: string[], recursive?: boolean) {
    this.requireAll({ dirname: dir, recursive: true, filter      :  /(Controller|Service|Model|Middleware)\.ts/, });
  }

  registerControllerActions(controllerMetadatas: ControllerMetadata[]) {
    controllerMetadatas.filter(ctrl => ctrl.route && !ctrl.parent).forEach(ctrl => {
      let ctrls = this._metadataStorage.findActionMetadatasForControllerMetadata(ctrl)
      ctrls.forEach((action, index) => {
        const middlewares = this._metadataStorage.findMiddlewareMetadatasFromControllerMetadata(ctrl);
        const params = this._metadataStorage.findParamMetadatasFromControllerMetadataAndActionMetadata(ctrl, action);
        const propertyMetadata = this._metadataStorage.findResponsePropertyMetadataForControllerAndActionMetadata(ctrl, action);
        this.registerAction(null, ctrl, action, propertyMetadata, index ===  0, index === ctrls.length - 1, middlewares, params);
      })
    })
    this.bfsRegisterSubcontrollerActions(null, controllerMetadatas);
    this.framework.routes()
  }

  bfsRegisterSubcontrollerActions(root: ControllerMetadata, controllerMetadatas: ControllerMetadata[]) {
    let nodes = null
    if (!root) {
      nodes = controllerMetadatas.filter(c => !c.parent)
    } else {
      nodes = controllerMetadatas.filter(c => c.parent && c.parent.constructor === root.object)
    }
    if (!nodes || !nodes.length) {
      return
    }
    nodes.forEach(n => {
      if (!n.router) {
        this.registerSubActions(n)
      }
      this.bfsRegisterSubcontrollerActions(n, controllerMetadatas)
    })
  }

  registerSubActions(ctrl) {
    let [ parent ] = this._metadataStorage.controllerMetadatas.filter(c => c.object === ctrl.parent.constructor)
    let actions = this._metadataStorage.findActionMetadatasForControllerMetadata(ctrl)
    actions.forEach((action, index) => {
      const middlewares = this._metadataStorage.findMiddlewareMetadatasFromControllerMetadata(ctrl);
      const params = this._metadataStorage.findParamMetadatasFromControllerMetadataAndActionMetadata(ctrl, action);
      const propertyMetadata = this._metadataStorage.findResponsePropertyMetadataForControllerAndActionMetadata(ctrl, action);
      this.registerAction({ prefix: ctrl.route, router: parent.router }, ctrl, action, propertyMetadata, index === 0, index === actions.length - 1, middlewares, params);
    })
  }

  private set container(value: any) {
    this._container = value;
  }

  private set isLogErrorEnable(boolean: any) {
    this._isLogErrorEnable = boolean;
  }

  private registerAction(root: any, controller: ControllerMetadata, action: ActionMetadata, properties: ResponsePropertyMetadata[], isNew, isComplete, middlewares?: MiddlewareMetadata[], params?: ParamMetadata[]) {
    let path = action.route;
    let router = null 
    if (controller.router) {
      router = controller.router
    } else if (controller.parent) {
      router = this.framework.getRouter()
    } else {
      router = this.framework.getRouter(controller.route)
    }
    controller.router = router
    var args = [
      root,
      controller.router, 
      path, 
      action.type, 
      async (request: any, response: any, ctx?: any, next?: Function) => await this.handle(request, response, controller, action, properties, params, path, ctx, next)
    ]
    var usesForController = this._metadataStorage.findUsesForControllerMetadata(controller)
    var usesForAction = this._metadataStorage.findUsesForControllerMetadataAndActionMetadata(controller, action)
    let [beforeControllerMiddlewares, afterControllerMiddlewares, beforeActionMiddlewares, afterActionMiddlewares] = this.arrangeUses(usesForController, usesForAction)
    args = [...args, 
      isNew, 
      isComplete, 
      beforeControllerMiddlewares || [],
      afterControllerMiddlewares || [],
      beforeActionMiddlewares,
      afterActionMiddlewares
    ]
    this.framework.registerAction.apply(this.framework, args);
  }

  private arrangeUses(usesForControllerMetadata: UsesMetadata[], usesForActionMetadata: UsesMetadata[]): Array<any> {
    let res = []
    let beforeControllerMiddlewares = []
    let afterControllerMiddlewares = []
    let beforeActionMiddlewares = []
    let afterActionMiddlewares = []
    if ( usesForControllerMetadata && usesForControllerMetadata.length) {
      usesForControllerMetadata.map(u => {
        if (u.type === UsesType.BEFORE) {
          beforeControllerMiddlewares = beforeControllerMiddlewares.concat(u.middlewares)
        } else {
          afterControllerMiddlewares = afterControllerMiddlewares.concat(u.middlewares)
        }
      })
    }
    if ( usesForActionMetadata && usesForActionMetadata.length) {
      usesForActionMetadata.map(u => {
        if (u.type === UsesType.BEFORE) {
          beforeActionMiddlewares = beforeActionMiddlewares.concat(u.middlewares)
        } else {
          afterActionMiddlewares = afterActionMiddlewares.concat(u.middlewares)
        }
      })
    }
    return [
      beforeControllerMiddlewares, 
      afterControllerMiddlewares,
      beforeActionMiddlewares,
      afterActionMiddlewares
    ];
  }

  private composePath(controllerMetadata: ControllerMetadata, actionMetadata: ActionMetadata) {
    var path = '';
    if (!controllerMetadata.parent) {
      path += controllerMetadata.route ? controllerMetadata.route : '';
    }
    path += actionMetadata.route ? actionMetadata.route : '';
    return path;
  }

  private async handle(req: any,
    res: any,
    controllerMetadata: ControllerMetadata,
    actionMetadata: ActionMetadata,
    properties: ResponsePropertyMetadata[],
    paramMetadatas: ParamMetadata[],
    path: string | RegExp,
    ctx?: any,
    next?: Function
  ) {
    const isJson = this.isActionMustReturnJson(controllerMetadata.type, actionMetadata.options);
    const controllerObject = this.getControllerInstance(controllerMetadata);
    const contentTypeMetadata = properties.reduce((prev, curr) =>
      curr.type === ResponsePropertyType.CONTENT_TYPE ? curr : prev
      , undefined);
    const successHttpCodeMetadata = properties.reduce((prev, curr) =>
      curr.type === ResponsePropertyType.SUCCESS_CODE ? curr : prev
      , undefined);
    const errorHttpCodeMetadata = properties.reduce((prev, curr) =>
      curr.type === ResponsePropertyType.ERROR_CODE ? curr : prev
      , undefined);
    const redirectMetadata = properties.reduce((prev, curr) =>
      curr.type === ResponsePropertyType.REDIRECT ? curr : prev
      , undefined);
    const renderMetadata = properties.reduce((prev, curr) =>
      curr.type === ResponsePropertyType.RENDERED_TEMPLATE ? curr : prev
      , undefined);
    const headerMetadatas = properties.filter((property) =>
      property.type === ResponsePropertyType.HEADER
    ).map((headerMetadata) => ({ name: headerMetadata.value, value: headerMetadata.value2 }))
    var resultOptions: ResultHandleOptions = {
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
    }
    if (contentTypeMetadata && contentTypeMetadata.value) {
      resultOptions.headers.push({ name: 'Content-Type', value: contentTypeMetadata.value })
    }
    try {
      const paramsTmp = paramMetadatas
        .sort((param1, param2) => param1.index - param2.index)
      let params = null;

      if (!ctx) {
        params = paramsTmp.map((paramMetadata) => this._paramHandler.handleParam(req, res, paramMetadata));
      } else {
        params = paramsTmp.map((paramMetadata) => this._paramHandler.handleParam(ctx, paramMetadata));
      }
      
      let result = null
      let args = params
      if (ctx) {
        if (
          !params 
          || !params.length 
          || params.filter(p => typeof p != 'undefined').length <= 0) {
          args = [{ ctx, next }]
        } else {
          args = [...params, { ctx, next }]
        }
      }

      result = await controllerObject[actionMetadata.method].apply(controllerObject, args);

      await this.framework.doChain(ctx, next, path, controllerMetadata.router)

      this.handleSuccess(result, resultOptions);
    } catch (e) {
      this.handleError(e, resultOptions);
    }
  }

  public wireModules() {
    this.collectModelsToApplicationContext()
    this.collectServicesToApplicationContext()
    this.framework.ctx = this.applicationContext;
  }

  get applicationContext() {
    return this._applicationContext;
  }

  private collectModelsToApplicationContext() {
    let models = this._metadataStorage.modelMetadatas;
    models.forEach(metadata => {
      this._domainBuilder.build(metadata)
    })
  }

  private collectServicesToApplicationContext() {
    let services = this._metadataStorage.serviceMetadatas;
    services.forEach(metadata => {
      let serviceInst = new (<any>metadata.object)(this.applicationContext);
      this.applicationContext.services[<any>metadata.object.name] = serviceInst;
    })
  }

  private isActionMustReturnJson(controllerType: ControllerType, actionOption: ActionOptions): boolean {
    if (actionOption && actionOption.jsonResponse) {
      return true;
    }
    if (controllerType === ControllerType.Json && actionOption && actionOption.textResponse) {
      return false;
    }
    return controllerType === ControllerType.Json;
  }

  private getControllerInstance(metadata: ControllerMetadata) {
    if (this._container) {
      return this._container.get(metadata.object.name);
    }
    if (!metadata.instance) {
      metadata.instance = new (<any>metadata.object)()
    }
    return metadata.instance;
  }

  private handleSuccess(value: any, resultOptions: ResultHandleOptions) {
    resultOptions.content = value;
    this.framework.handleSuccess(resultOptions);
  }

  private handleError(e: Error, resultOptions: ResultHandleOptions) {
    if (this._isLogErrorEnable) {
      console.error(e.stack ? e.stack : e);
    }
    resultOptions.content = e;
    this.framework.handleError(resultOptions);
  };
}