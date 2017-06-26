"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
class DomainBuilder {
    constructor(applicationContext) {
        this.applicationContext = applicationContext;
    }
    build(metadata) {
        let originSchemaMetadata = new metadata.object();
        let { options, methods, staticMethods, invocations } = this.extractRules(originSchemaMetadata);
        let schema = new mongoose.Schema(originSchemaMetadata, options);
        let model = mongoose.model(metadata.object.name, schema);
        this.applicationContext.models[metadata.object.name] = model;
    }
    extractRules(metadata) {
        let addons = {};
        if (metadata.options) {
            addons['options'] = metadata.options;
            delete metadata['options'];
        }
        if (metadata.methods) {
            addons['methods'] = metadata.methods;
            delete metadata['methods'];
        }
        if (metadata.staticMethods) {
            addons['staticMethods'] = metadata.staticMethods;
            delete metadata['staticMethods'];
        }
        if (metadata.invocations) {
            addons['invocations'] = metadata.invocations;
            delete metadata['invocations'];
        }
        return addons;
    }
    extractModelName(name) {
        if (!name.match(/Schema/)) {
            throw new Error(`Failed to build domain, [reason]=schema named wrong, [name]=${name}`);
        }
        return name.replace('Schema', '');
    }
}
DomainBuilder.reservedProps = ['options', 'methods', 'staticMethods', 'invocations'];
exports.default = DomainBuilder;
//# sourceMappingURL=domainBuilder.js.map