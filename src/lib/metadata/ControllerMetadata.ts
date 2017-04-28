"use strict";
/**
 * Controller metadata used to storage information about registered controller.
 */
export interface ControllerMetadata{
    router?: any;
    /**
     * Base route for all actions registered in this controller.
     */
    route: string;
    /**
     * Indicates object which is used by this controller.
     */
    object: Function;
    /**
     * Instance of the object that is used to call controller methods on.
     */
    instance?: Object;
    /**
     * Controller type. Can be default, or json-typed. Can be one of the value defined in ControllerType class.
     */
    type: number;
}
export enum ControllerType{
    /**
     * Default controller type.
     */
    Default = 0,
    /**
     * JSON controller type.
     */
    Json = 1
}