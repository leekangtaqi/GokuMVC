import {ResultHandleOptions} from "./../ResultHandleOptions";
/**
 * Abstract layer to organize controllers integration with different http server implementations.
 */
export interface Server {
    getRouter():any;
    /**
     * Registers action in the server framework.
     *
     * @param route URI path to be registered (for example /users/:id/photos)
     * @param actionType HTTP action to be performed on registered path (GET, POST, etc.)
     * @param executeCallback Function to be called when request comes on the given route with the given action
     */
    registerAction(router: any, route: string|RegExp, actionType: string, executeCallback: (req: any, res: any)=> any, middlewares?: Function[]): void;
    /**
     * Gets param from the request.
     *
     * @param request Request made by a user
     * @param paramName Parameter name
     * @param paramType Parameter type
     */
    getParamFromRequest(req: any, paramName: string, paramType: string): void;
    
        /**
     * Defines an algorithm of how to handle error during executing controller action.
     *
     * @param options Handling performs on these options
     */
    handleError(options: ResultHandleOptions): void;

    /**
     * Defines an algorithm of how to handle success result of executing controller action.
     *
     * @param options Handling performs on these options
     */
    handleSuccess(options: ResultHandleOptions): void;
}