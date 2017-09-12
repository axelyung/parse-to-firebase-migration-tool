import Parse from 'parse';
import { clone } from './utils';

export function parseInit(parseConfig){
    let init = Parse.initialize(parseConfig.app_id, parseConfig.js_key);
    Parse.masterKey = parseConfig.master_key;
    Parse.serverURL = parseConfig.server_url;
    return init;
}

export async function getParseClass(className){
    let query = new Parse.Query(Parse.Object.extend(className));
    let count = await query.count()
    query.limit(count);
    return query.find({ useMasterKey: true });
}

export function excludeFields(parseObj, dbConfig){
    let globalExclude = dbConfig.exclude_fields;
    let tableExclude = dbConfig.tables.find(el => {
        return el.parse_class === parseObj.className
    }).exclude_fields;
    let excluded = globalExclude.concat(tableExclude);
    let attributes = clone(parseObj.attributes);
    excluded.forEach(excludedAttribute => {
        delete attributes[excludedAttribute];
    })
    return attributes;
}