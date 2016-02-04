"use strict";
import SchemaPlugin  = require('./SchemaPlugin');

class CreatedOn extends SchemaPlugin{
    name: string;
    prop: string;
    type: any;
    
    constructor(o){
        super(o);
    };
    use(schema, options){
        var path = {};
        path[this.prop] = this.type;
        schema.add(path);
        schema.pre('save', function(next){
            console.log(this);
            this['autoCreatedOn']();
            next();
        }, this);
        schema.method('autoCreatedOn', function(time?: Date){
            !time && (time = new Date()); 
            return this[this.prop] = time;
        });    
    }
}
export = new CreatedOn({
    name: 'createdOn',
    prop: 'crtOn',
    type: { 
        type: Date    
    }
}); 