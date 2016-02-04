"use strict";
var mongoose = require('mongoose');
var _BasicPlugins = [];
var _BaseOptions = {
    strict: true,
    toJSON: { getter: true, virtuals: true },
    toObject: { getter: true, virtuals: true }
};
var _plugins = {};
module.exports = class SchemaBuilder {
    constructor(name) {
        this.name = name;
        this.options = [];
        this.properties = [];
        this.usePlugins = [];
    }
    ;
    static get BaseOptions() {
        return {
            strict: true,
            toJSON: { getter: true, virtuals: true },
            toObject: { getter: true, virtuals: true }
        };
    }
    static set BaseOptions(value) {
        _BaseOptions = value;
    }
    static get BasicPlugins() {
        return _BasicPlugins;
    }
    static get plugins() {
        return _plugins;
    }
    static plug(plugin, basicPlugin) {
        plugin.register(SchemaBuilder);
        if (basicPlugin) {
            SchemaBuilder.BasicPlugins.push(plugin);
        }
    }
    ;
    static i(name) {
        return new SchemaBuilder(name);
    }
    ;
    withBasicOptions() {
        _.extend(this.options, SchemaBuilder.BaseOptions);
        return this;
    }
    ;
    withBasicProperties() {
        SchemaBuilder.BasicPlugins.forEach((plugin, index) => {
            this.usePlugins[plugin.prop] = null;
        }, this);
        return this;
    }
    ;
    withProperties(properties) {
        _.extend(this.properties, properties);
        return this;
    }
    ;
    withBasis() {
        this.withBasicOptions();
        this.withBasicProperties();
        return this;
    }
    ;
    build() {
        var schema = new mongoose.Schema(this.properties, this.options);
        schema['name'] = this.name;
        schema['model'] = function (register) {
            var model = null;
            if (register) {
                model = mongoose.model(this.name, this);
            }
            else {
                model = mongoose.model(this.name);
            }
            return model;
        };
        for (var prop in this.usePlugins) {
            if (this.properties[prop]) {
                throw new Error('property ' + prop + ' is duplicatedly defined and conflicts with Plugin ' + SchemaBuilder.plugins[prop].name);
            }
            SchemaBuilder.plugins[prop].use(schema, this.usePlugins[prop]);
        }
        return schema;
    }
    ;
}
;
