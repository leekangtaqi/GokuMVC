"use strict";
class Context {
    constructor() {
        this.settings = {};
        this.redis = {};
        this.mongoose = {};
        this.domainBuilder = {};
        this.logger = {};
        this.helpers = {};
        this.models = {};
        this.kvs = {};
        this.services = {};
    }
}
module.exports = new Context();
