"use strict";
/**
 * Action metadata used to storage information about registered action.
 */
export interface ActionMetadata{
    /**
     * Route to be registered for the action.
     */
    route: string|RegExp;
    /**
     * Object on which's method this action is attached.
     */
    object: any;
    /**
     * Object's method that will be executed on this action.
     */
    method: string;
    /**
     * Action method in ActionType
     */
    type: string;
    /**
     * Additional action options.
     */
    options: ActionOptions;
}

/**
 * Extra that can be set to action.
 */
export interface ActionOptions{
    /**
     * If set to true then response will be forced to json (serialized and application/json content-type will be used).
     */
    jsonResponse?: boolean;
    /**
     * If set to true then response will be forced to simple string text response.
     */
    textResponse?: boolean;
}

export class ActionType{
    static GET = 'GET';
    static POST = 'POST';
    static PUT = 'PUT';
    static DELETE = 'DELETE';
}