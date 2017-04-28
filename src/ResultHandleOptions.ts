"use strict";
/**
 * Options used to send to framework result handlers.
 */
export interface ResultHandleOptions {

    /**
     * User request.
     */
    request: any;

    /**
     * User response.
     */
    response: any;

    /**
     * Content to be sent in result.
     */
    content: any;

    /**
     * Indicates if response result should be handled as json.
     */
    asJson: boolean;

    /**
     * Status code to be set in the response result in the case if response success.
     */
    successHttpCode: number;

    /**
     * Status code to be set in the response result in the case if response fail.
     */
    errorHttpCode: number;

    /**
     * If set then redirection will work on the given address.
     */
    redirect: string;

    /**
     * Custom response headers.
     */
    headers: {
        name: string;
        value: string;
    }[];

    /**
     * Template to be rendered.
     */
    renderedTemplate: string;

}