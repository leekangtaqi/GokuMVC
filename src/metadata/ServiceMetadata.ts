"use strict";
/**
 * Controller metadata used to storage information about registered controller.
 */
export interface ServiceMetadata{
    namespace: string;
    /**
     * Indicates object which is used by this controller.
     */
    object: Function;
    /**
     * Instance of the object that is used to call controller methods on.
     */
    instance?: Object;
}
