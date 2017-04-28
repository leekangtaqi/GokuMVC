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
     * Handler on which's object this middleware is attached.
     */
    method: string;
}