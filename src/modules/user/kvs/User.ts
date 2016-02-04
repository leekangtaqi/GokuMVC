"use strict";
import Model = require('../models/User');

export = class Kv{
    private context;
    constructor(context){
        this.context = context;
    }
    save(user: Model.IUser){
        
    }
}