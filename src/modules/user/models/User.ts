export interface IUser{
    name?: string,
    desc?: string
}
export function User(domainBuilder){
    var schema = domainBuilder
    .i('User')
    .withBasis()
    .withCreatedOn()
    .withProperties({
        name:         {type: String, required: true},
        desc:         {type: String}
    })
    .build();
    return schema.model(true);
}