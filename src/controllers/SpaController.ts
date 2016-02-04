"use strict";
import {Controller, Render, Get} from '../framework/rodos/Decorators';
import express = require('express');

@Controller('/')
class SpaController{
    constructor(){};
    @Get('/')
    @Render('index')
    async getUserById(){
        return {name: 'Hello World'}
    }
}

