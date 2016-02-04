"use strict";
import mongoose = require('mongoose');
import SchemaPlugin = require('./SchemaPlugin');

//static properties
var _BasicPlugins = [];
var _BaseOptions = {
    strict: true,
    toJSON: { getter: true, virtuals: true },
    toObject: { getter: true, virtuals: true } 
};
var _plugins = {};

export = class SchemaBuilder{
    private name: string;
    private options: any[];
    private properties: any[];
    private usePlugins: any[];
    
    constructor(name: string){
        this.name = name;
        this.options = [];
        this.properties = [];
        this.usePlugins = [];
    };
    
    public static get BaseOptions(){
        return {
            strict: true,
            toJSON: { getter: true, virtuals: true },
            toObject: { getter: true, virtuals: true } 
        };
    }
    
    public static set BaseOptions(value){
        _BaseOptions = value;
    }
    
    public static get BasicPlugins(){
        return _BasicPlugins;
    }
    
    public static get plugins(){
        return _plugins;
    }
    
    public static plug(plugin, basicPlugin: boolean){
        plugin.register(SchemaBuilder);
        if(basicPlugin){
            SchemaBuilder.BasicPlugins.push(plugin);
        }
    };
    //factory method
    static i(name: string){
        return new SchemaBuilder(name);
    };
    public withBasicOptions(){
        _.extend(this.options, SchemaBuilder.BaseOptions);
        return this;
    };
    public withBasicProperties(){
        SchemaBuilder.BasicPlugins.forEach((plugin, index)=>{
            this.usePlugins[plugin.prop] = null;
        }, this);
        return this;
    };
    public withProperties(properties){
        _.extend(this.properties, properties);
        return this;
    };
    public withBasis(){
        this.withBasicOptions();
        this.withBasicProperties();
        return this;
    };
    public build(){
        var schema: mongoose.Schema = new mongoose.Schema(this.properties, this.options);
        schema['name'] = this.name;
        schema['model'] = function(register){
            var model = null;
            if(register){
                model = mongoose.model(this.name, this);
            }
            else{
                model = mongoose.model(this.name);
            }
            return model;
        };
        for(var prop in this.usePlugins){
            if(this.properties[prop]){
                throw new Error('property ' + prop + ' is duplicatedly defined and conflicts with Plugin ' + SchemaBuilder.plugins[prop].name);
            }
            SchemaBuilder.plugins[prop].use(schema, this.usePlugins[prop]);
        }
        return schema;
    };
}