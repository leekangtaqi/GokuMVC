import DomainBuilder = require('./SchemaBuilder');
import createOn = require('./CreateOn');
 
DomainBuilder.plug(createOn, true);

export = DomainBuilder;