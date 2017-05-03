"use strict";
/**
 * Action metadata used to storage information about registered action.
 */
export interface MiddlewareMetadata{
    /**
     * Object on which's method this middleware is attached.
     */
    object: any;

    /**
     * Global middleware or not.
     */
    isGlobal: boolean;

    /**
     * Middleware instance.
     */
    instance?: any
}