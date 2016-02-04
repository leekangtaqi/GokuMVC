"use strict";
import {ParamMetadata, ParamType} from './metadata/ParamMetadata';
import {Server} from './server/Server';

export class ParamHandler{
    constructor(private framework: Server){}
    handleParam(req: any, res: any, param: ParamMetadata){
        var value: any;
        switch(param.type){
            case ParamType.REQ:
                value = req;
                break;
            case ParamType.RES:
                value = res;
            default:
                value = this.framework.getParamFromRequest(req, param.name, param.type);
                if (value) {
                   value = this.handleParamFormat(value, param); 
                }
                break;
        }           
    }
    handleParamFormat(value: any, param: ParamMetadata): any{
        const format = param.format;
        const formatName: string = format instanceof Function && format.name ? format.name: format instanceof String? format: '';
        switch(formatName.toLowerCase()){
            case 'number':
                return +value
                break;
            case 'string':
                return value;
                break;
            case 'boolean':
                return !!value;
                break;
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
