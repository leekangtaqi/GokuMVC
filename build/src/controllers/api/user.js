"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
let UserController = class {
    getUserById(id) {
        console.log(id);
    }
    toString() {
        return '111';
    }
};
__decorate([
    route({ path: '/', method: 'get' }),
    interceptor(middleware),
    log, 
    __metadata('design:type', Function), 
    __metadata('design:paramtypes', [Object]), 
    __metadata('design:returntype', void 0)
], UserController.prototype, "getUserById", null);
UserController = __decorate([
    Controller, 
    __metadata('design:paramtypes', [])
], UserController);
function route(o) {
    return function (t, p, d) {
    };
}
function middleware() {
}
function interceptor(middleware) {
    return function (t, p, d) {
    };
}
function log(t, p, d) {
}
function Controller(t) {
    console.log('controller');
    console.log(t.toString());
}
function index() {
    return require('express').Router();
}
exports.index = index;
;
