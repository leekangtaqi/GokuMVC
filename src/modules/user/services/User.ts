"use strict";
import Model = require('../models/User');

export = class UserSerivice{
    private context;
    constructor(context){
        this.context=context;
    };
    create(user: Model.IUser, callback){
        var User = this.context.models.User;
        var userModel = new User(user);
        userModel
            .save()
            .then((doc)=>{
                callback(null, doc)
            }, (err)=>{
                callback(err);    
            })
    };
}