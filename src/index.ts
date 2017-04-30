import Application, { IApplication, IContext } from './app'
import { IMiddleware, compose } from './middleware'
import {
  Get, 
  Use,
  Middleware, 
  UseBefore,
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
  Middleware, 
  UseBefore,
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
  IContext,
  IMiddleware,
  compose
}

export default { version: '2.0' }