"use strict";
(function (ResponsePropertyType) {
    ResponsePropertyType[ResponsePropertyType["SUCCESS_CODE"] = 1] = "SUCCESS_CODE";
    ResponsePropertyType[ResponsePropertyType["ERROR_CODE"] = 2] = "ERROR_CODE";
    ResponsePropertyType[ResponsePropertyType["CONTENT_TYPE"] = 3] = "CONTENT_TYPE";
    ResponsePropertyType[ResponsePropertyType["HEADER"] = 4] = "HEADER";
    ResponsePropertyType[ResponsePropertyType["RENDERED_TEMPLATE"] = 5] = "RENDERED_TEMPLATE";
    ResponsePropertyType[ResponsePropertyType["REDIRECT"] = 6] = "REDIRECT";
})(exports.ResponsePropertyType || (exports.ResponsePropertyType = {}));
var ResponsePropertyType = exports.ResponsePropertyType;
