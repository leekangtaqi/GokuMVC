"use strict";
var SchemaPlugin = require('./SchemaPlugin');
class CreatedOn extends SchemaPlugin {
    constructor(o) {
        super(o);
    }
    ;
    use(schema, options) {
        var path = {};
        path[this.prop] = this.type;
        schema.add(path);
        schema.pre('save', function (next) {
            console.log(this);
            this['autoCreatedOn']();
            next();
        }, this);
        schema.method('autoCreatedOn', function (time) {
            !time && (time = new Date());
            return this[this.prop] = time;
        });
    }
}
module.exports = new CreatedOn({
    name: 'createdOn',
    prop: 'crtOn',
    type: {
        type: Date
    }
});
