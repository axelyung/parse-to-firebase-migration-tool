import config from '../config.json';

import { firebaseInit, authWithFacebook, firebaseFormat, pushToFirebase } from './firebase'
import { parseInit, getParseClass, excludeFields } from './parse';
import { pluralizeString, msToSec } from './utils';

export async function migrate(logFn) {
    try {
        let tablesSummary = [];
        let nodesSummary = [];
        logFn('Migration start');
        let startTime = Date.now();
        logFn('Fetching from Parse...');
        let nodesPromise = config.db.tables.map(async table => {
            let response = await getParseClass(table.parse_class);
            logFn('&nbsp;&nbsp;&nbsp;- ' + table.parse_class);
            tablesSummary.addSummary(table.parse_class, response.length)
            let data = firebaseFormat(response, config.db);
            let name = table.firebase_node || pluralizeString(table.parse_class);
            return { name, data };
        })
        let nodes = await Promise.all(nodesPromise)
        let firebaseDb = {};
        logFn('Fetch complete');
        logFn('Pushing to Firebase... ');
        let firebasePromises = nodes.map(async node => {
            firebaseDb[node.name] = node.data;
            await pushToFirebase(node.name, node.data);
            logFn('&nbsp;&nbsp;&nbsp;- ' + node.name);
            nodesSummary.addSummary(node.name, Object.keys(node.data).length);
            return node;
        })
        await Promise.all(firebasePromises);
        logFn('Push complete');
        let endTime = Date.now();
        logFn('Migration end');
        let elapsed = (endTime - startTime) / 1000;
        return {
            status: 'SUCCESS',
            message: `
                <div>&nbsp;&nbsp;&nbsp;- Migration took ${elapsed}sec</div>
                <div>&nbsp;&nbsp;&nbsp;- Read ${tablesSummary.length} tables in Parse database</div>
                <div>&nbsp;&nbsp;&nbsp;- Created ${nodesSummary.length} nodes in Firebase</div>
            `
        };
    } catch (err) {
        console.log('here');
        return {
            status: 'FAILED',
            message: err
        }
    }
}

export async function simulate(logFn) {
    let tablesSummary = [];
    let startTime = Date.now();
    logFn('Simulation start')
    logFn('Fetching from Parse...');
    let nodesPromise = config.db.tables.map(async table => {
        let response = await getParseClass(table.parse_class);
        logFn('&nbsp;&nbsp;&nbsp;- ' + table.parse_class);
        tablesSummary.addSummary(table.parse_class, response.length)
        let data = firebaseFormat(response, config.db);
        let name = table.firebase_node || pluralizeString(table.parse_class);
        return { name, data };
    })
    let nodes = await Promise.all(nodesPromise);
    logFn('Simulation end');
    let message = `<div>Migration includes ${tablesSummary.length} tables in Parse database:</div>`
    tablesSummary.forEach(table =>{
        message += `<div>&nbsp;&nbsp;&nbsp;- ${table.name} : ${table.count} rows`;
    });
    return {
        status: 'SUMMARY',
        message: message
    }
}

Array.prototype.addSummary = function (name, count) {
    this.push({ name, count })
}