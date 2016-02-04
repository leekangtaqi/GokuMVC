"use strict";
module.exports = class SchemaPlugin {
    constructor(o) {
        this.name = o.name;
        this.prop = o.prop;
        this.type = o.type;
        this.methodName = 'with' + this.name.charAt(0).toUpperCase() + this.name.slice(1);
    }
    register(builderClass) {
        builderClass.plugins[this.prop] = this;
        var plugin = this;
        builderClass.prototype[this.methodName] = function (options) {
            this.usePlugins[plugin.prop] = options;
            return this;
        };
    }
    ;
    use(schema, options) { }
    ;
}
;
