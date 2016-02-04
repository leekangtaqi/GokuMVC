"use strict";
export interface ParamMetadata{
    object: any;
    
    method: string;
    
    index: number;
    
    type: string; //ParamMetadataType
    
    parseJson: boolean;
    
    isRequired: boolean;
    
    format?: any;
    
    name?: string;
}

export class ParamType{
    static BODY = 'Body';
    static PARAM = 'Param';
    static QUERY = 'Query';
    static REQ = 'Req';
    static RES = 'Res';
    static COOKIE = 'Cookie';
}