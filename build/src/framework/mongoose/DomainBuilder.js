var DomainBuilder = require('./SchemaBuilder');
var createOn = require('./CreateOn');
DomainBuilder.plug(createOn, true);
module.exports = DomainBuilder;
