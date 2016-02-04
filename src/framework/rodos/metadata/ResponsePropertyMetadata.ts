"use strict";
export interface ResponsePropertyMetadata{
    object: Object,
    method: string,
    value: any,
    value2?: any,
    type: ResponsePropertyType
}

export enum ResponsePropertyType {
    SUCCESS_CODE = 1,
    ERROR_CODE = 2,
    CONTENT_TYPE = 3,
    HEADER = 4,
    RENDERED_TEMPLATE = 5,
    REDIRECT = 6,
}