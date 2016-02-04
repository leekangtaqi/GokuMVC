"use strict";
import {Server} from './Server';
import * as e from 'express';
import {ParamMetadata, ParamType} from '../metadata/ParamMetadata';
import {ResultHandleOptions} from '../ResultHandleOptions';

export class ExpressServer implements Server {
    constructor(private express: e.Express){}
    getRouter(){
        return e.Router();
    }
    registerAction(router: any,route: string|RegExp, actionType: string, executeCallback: (req: any, res: any)=> any, middlewares?: Function[]){
        middlewares && middlewares.forEach(fn => router.use(fn));
        actionType = actionType.toLowerCase();
        if(!router[actionType]){
            throw new Error('Express Router does not have such action ' + actionType);
        }
        router[actionType](route, executeCallback);
        this.express.use(router);
    }
    getParamFromRequest(request: e.Request, paramName: string, paramType: string): void{
        switch (paramType) {
            case ParamType.BODY:
                return request.body;
            case ParamType.PARAM:
                return request.params[paramName];
            case ParamType.QUERY:
                return request.query[paramName];
            case ParamType.COOKIE:
                return request.cookies[paramName];
        }
    }
    handleSuccess(options: ResultHandleOptions){
        var response: e.Response = options.response;
        if(options.successHttpCode){
            response.status(options.successHttpCode);            
        }
        this.handleResult(options);
    }
    handleError(options: ResultHandleOptions){
        var response: e.Response = options.response;
        if(options.errorHttpCode){
            response.status(options.errorHttpCode);    
        }
        this.handleResult(options);
    }
    handleResult(options: ResultHandleOptions){
        var response: e.Response = options.response;
        if(options.headers){
            options.headers.forEach((header)=> response.header(header.name, header.value))
        }
        if(options.content){
            if(options.renderedTemplate){
                const result = options.content && options.content instanceof Object ? options.content : {};
                this.express.render(options.renderedTemplate, result, (err, html)=>{
                    if(err && options.asJson){
                        response.json(err);
                    }
                    else if(err && !options.asJson){
                        response.send(err);
                    }
                    else if(html){
                        response.send(html);
                    }
                    response.end();
                })
            }else{
                if(options.redirect){
                    response.redirect(options.redirect);
                }
                else if(options.asJson){
                    response.json(options.content);
                }
                else{
                    response.send(options.content);
                }
                response.end();
            }
            
        }else{
            response.end();
        }
    }
}