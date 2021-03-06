import Application, { IApplication, IContext } from './app'
import { IMiddleware, compose } from './middleware'
import { IApplicationContext } from './context'
import { VERSION } from './const'
import {
  Get,
  Use,
  Mount,
  Middleware,
  UseBefore,
  UseAfter,
  Param,
  Body,
  Req,
  Res,
  Render,
  Redirect,
  Domain,
  Service,
  Controller,
  GlobalMiddleware
} from './Decorators'

export {
  Get,
  Use,
  Mount,
  Middleware,
  UseBefore,
  UseAfter,
  Param,
  Body,
  Req,
  Res,
  Render,
  Redirect,
  Domain,
  Service,
  Controller,
  GlobalMiddleware,
  Application,
  IApplication,
  IApplicationContext,
  IContext,
  IMiddleware,
  compose
}

export default { version: VERSION }