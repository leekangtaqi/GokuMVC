"use strict";
import { Server } from './Server';
import * as Koa from 'koa';
import * as Router from 'koa-router'
import { Request, Response, Context } from 'koa';
import { ParamMetadata, ParamType } from '../metadata/ParamMetadata';
import { ResultHandleOptions } from '../ResultHandleOptions';
import { IApplication } from '../';
import ApplicationContext, { IApplicationContext } from '../context'

export interface IKoa extends Koa, Server, IApplication {
  ctx? :any
}

export class KoaServer implements Server, IApplication {
  router: Router;
  ctx: IApplicationContext;
  routerPrefixMap = new Map();
  rootRouters = new Set();
  mountQueue = []
  constructor(private koa: IKoa) {
    this.ctx = this.koa.ctx = new ApplicationContext()
  }

  getRouter(prefix) {
    if (prefix) {
      return new Router({ prefix })
    }
    return new Router()
  }

  routes() {
    this.execQueue()
    for (let r of this.rootRouters) {
      this.koa
        .use(r.routes())
        .use(r.allowedMethods())
    }
  }

  registerAction(root: any, router: any, route: string | RegExp, actionType: string, executeCallback: Function, isNew, isComplete, beforeControllerMiddlewares?: Function[], afterControllerMiddlewares?: Function[], beforeActionMiddlewares?: Function[], afterActionMiddlewares?: Function[]) {
    actionType = actionType.toLowerCase();

    if (!router[actionType]) {
      throw new Error('Koa Router does not have such action ' + actionType);
    }

    if (isNew && beforeControllerMiddlewares && beforeControllerMiddlewares.length) {
      beforeControllerMiddlewares.forEach(m => router.use(m))
    }

    let args: any[] = [route]

    if (beforeActionMiddlewares && beforeActionMiddlewares.length) {
      args = [...args, ...beforeActionMiddlewares]
    }

    args.push((ctx: Context, next: Function) => executeCallback(ctx.request, ctx.response, ctx, next))
    
    if (afterActionMiddlewares && afterActionMiddlewares.length) {
      args = [...args, ...beforeActionMiddlewares]
    }

    router[actionType].apply(router, args);

    if (isComplete && afterControllerMiddlewares && afterControllerMiddlewares.length) {
      afterControllerMiddlewares.forEach(m => router.use(m))
    }

    if (root && isComplete) {
      if (root.router.opts.prefix) {
        this.routerPrefixMap.set(router, root.router.opts.prefix + root.prefix)
        this.enqueue(root.router, router, root.prefix)
      } else {
        this.enqueue(root.router, router, root.prefix)
      }
    }
    
    if (!root) {
      this.rootRouters.add(router)
    }
  }

  enqueue(to, from, prefix) {
    this.mountQueue.push({ to, from, prefix })
    
  }

  execQueue() {
    this.mountQueue.reverse();
    this.mountQueue.forEach(({ to, from, prefix }) => {
      let layersBefore = to.stack.map((l, i) => ({path: l.path, i}))
      to.use(prefix, from.routes(), from.allowedMethods())
      let layersAfter = to.stack.map((l, i) => ({path: l.path, i}))
      this.reorderLayers(layersBefore, layersAfter, to)
    })
  }

  reorderLayers(befores, afters, router) {
    let stack = router.stack
    let adds = stack.slice(befores.length)
    for (let i=0, len=befores.length; i<len; i++) {
      let b = befores[i]
      if (this.isConflict(b.path, afters[afters.length - 1].path)) {
        let prev = stack.slice(0, i)
        let suff = stack.slice(i, befores.length)
        router.stack = [...prev, ...adds, ...suff]
        break
      }
    }
  }

  isConflict(target, source) {
    if (!target || !source) {
      return false
    }
    let targetParts = target.split('/')
    let sourceParts = source.split('/')
    if (!targetParts || 
      !targetParts.length || 
      !sourceParts || 
      !sourceParts.length ||
      targetParts.length != sourceParts.length
    ) {
      return false
    }
    targetParts = targetParts.filter(p => p)
    sourceParts = sourceParts.filter(p => p)
    for (let i=0, len=targetParts.length; i<len; i++) {
      if (targetParts[i] === sourceParts[i]) {
        continue
      }
      else if (targetParts[i].startsWith(':')) {
        return true
      }
      return false
    }
    return false
  }

  getParamFromRequest(request: any, paramName: string, paramType: string): any {
    let val = null;
    switch (paramType) {
      case ParamType.BODY:
        val = request.body;
        break;
      case ParamType.PARAM:
        val = request.params[paramName];
        break;
      case ParamType.QUERY:
        val = request.query[paramName];
        break;
      case ParamType.COOKIE:
        val = request.cookies[paramName];
        break;
    }
    return val
  }

  handleSuccess(options: ResultHandleOptions) {
    var context: any = options.context;
    if (options.successHttpCode) {
      context.status = 200;
    }
    this.handleResult(options);
  }

  handleError(options: ResultHandleOptions) {
    var context: any = options.context;
    if (options.errorHttpCode) {
      context.status = options.errorHttpCode;
    }
    this.handleResult(options);
  }
  
  handleResult(options: ResultHandleOptions) {
    var context: any = options.context;
    var response: Response = context.response;
    // if (options.headers) {
    //   options.headers.forEach((header) => response.header(header.name, header.value))
    // }
    if (options.content) {
      if (options.renderedTemplate) {
        console.error('render not supported now.')
        // const result = options.content && options.content instanceof Object ? options.content : {};
        // this.koa.render(options.renderedTemplate, result, (err, html) => {
        //   if (err && options.asJson) {
        //     context.body = err;
        //   }
        //   else if (err && !options.asJson) {
        //     context.body = err;
        //   }
        //   else if (html) {
        //     response.send(html);
        //   }
        // })
      } else {
        if (options.redirect) {
          context.redirect(options.redirect);
        }
        else if (options.asJson) {
          context.body = options.content;
        }
        else {
          context.body = options.content;
        }
      }
    }
  }
}