"use strict";
export = class SchemaPlugin{
    protected name: string;
    protected prop: string;
    protected type: any;
    protected methodName: string;
     
    constructor(o: SchemaPlugin){
        this.name = o.name;
        this.prop = o.prop;
        this.type = o.type;
        this.methodName = 'with' + this.name.charAt(0).toUpperCase() + this.name.slice(1);
    }
    
    register(builderClass: any){
        builderClass.plugins[this.prop] = this;
        var plugin = this;
        builderClass.prototype[this.methodName] = function(options){
            this.usePlugins[plugin.prop] = options;
            return this;
        };
    };
    
    use(schema: any, options: any){};
}