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
  constructor(private koa: IKoa) {
    this.ctx = this.koa.ctx = new ApplicationContext()
  }

  getRouter(single: boolean = false) {
    if (!single) {
      return new Router();
    }
    if (this.router) {
      return this.router
    }
    this.router = new Router();
    return this.router;
  }

  registerAction(router: any, route: string | RegExp, actionType: string, executeCallback: Function, middlewares?: Function[]) {
    actionType = actionType.toLowerCase();
    if (!router[actionType]) {
      throw new Error('Koa Router does not have such action ' + actionType);
    }
    if (middlewares && middlewares.length) {
      router[actionType](route, ...middlewares, (ctx: Context, next: Function) => executeCallback(ctx.request, ctx.response, ctx, next));
    } else {
      router[actionType](route, (ctx: Context, next: Function) => executeCallback(ctx.request, ctx.response, ctx, next));
    }
    this.koa.use(router.routes());
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