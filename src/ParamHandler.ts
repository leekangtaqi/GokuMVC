"use strict";
import {ParamMetadata, ParamType} from './metadata/ParamMetadata';
import {Server} from './server/Server';

export class ParamHandler{
    constructor(private framework: Server){}
    handleParam(ctx: any, param: ParamMetadata): any;
    handleParam(req: any, res: any, param: ParamMetadata): any;
    handleParam(...args: Array<any>){
        let req = args[0]
        let res = args[1]
        let param = args[2]
        let ctx = null
        !param && (ctx = req) && (req = ctx.req) && (res = ctx.res) && (param = args[1])
        var value: any;
        switch(param.type){
            case ParamType.REQ:
                value = req;
                break;
            case ParamType.RES:
                value = res;
            default:
                value = this.framework.getParamFromRequest(ctx ? ctx : req, param.name, param.type);
                if (value) {
                   value = this.handleParamFormat(value, param); 
                }
                break;
        }
        return value; 
    }

    handleParamFormat(value: any, param: ParamMetadata): any{
        const format = param.format;
        const formatName: string = format instanceof Function && format.name ? format.name: format instanceof String? format: '';
        switch(formatName.toLowerCase()){
            case 'number':
                return +value
            case 'string':
                return value;
            case 'boolean':
                return !!value;
            default:
                if(value && param.parseJson){
                    value = this.parseValueToJson(value, param);  
                }
        }
        return value;  
    }
    parseValueToJson(value: any, param: ParamMetadata){
        try{
            const result = JSON.parse(value);
            if(param.format){
                Object.assign(new (param.format()), result);
            }else{
                return result;
            }
        }
        catch(e){
            throw new Error('parseValue to json failed');
        }
    }    
}
