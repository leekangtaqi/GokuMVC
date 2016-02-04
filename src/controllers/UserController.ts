"use strict";
import {Controller, Render, Get} from '../framework/rodos/Decorators';
import express = require('express');

@Controller('/api')
class UserController{
    constructor(){};
    @Get('/', {jsonResponse: true})
    async getUserById(){
        return {name: '111'}
    }
}

