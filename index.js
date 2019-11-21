#!/usr/bin/env node
global.fetch = require('node-fetch')
const argv = require('optimist').argv;
const cc = require('cryptocompare');
cc.setApiKey('2605c530c671f9c3ee1b94ca290d354b85d998dcdf43fc1e8349a44aa9b7f6f1')
const argument = argv._;
console.log('ARGUMENTS', argument);

let SYMBOLS = ['BTC', 'ETH', 'XRP'];
let CURRENCIES = ['USD'];

function isToken(arg) { // CHECK IF TOKE IS VALID e.g. BTC etc
    return SYMBOLS.some(r => arg.indexOf(r) >= 0) ? true : false
}

function isDate(arg) { // CHECK IF DATE CORRECT FORMAT e.g. 2000-01-01
    return Date.parse(arg[0]) ? true : false
}

if (argument.length < 1) { // FIND NO ARGUMENTS
    cc.priceMulti(SYMBOLS, CURRENCIES)
        .then(prices => console.log(prices))
        .catch(console.error)

} else if (argument.length == 2) { // FIND TWO ARGUMENTS
    // IGNORE ORDER 
    if (isDate(argument[0]) && isToken(argument[1])) {
        cc.priceHistorical(argument[1], CURRENCIES[0], new Date(argument[0])).then(prices => {
            console.log(prices);
        }).catch(console.error)
    } else if (isDate(argument[1]) && isToken(argument[0])) {
        cc.priceHistorical(argument[0], CURRENCIES[0], new Date(argument[1])).then(prices => {
            console.log(prices);
        }).catch(console.error)
    } else {
        console.log('invalid toke or date enter: e.g. BTC 2000-01-01 or 2000-01-01 BTC');
    }

} else if (argument.length == 1) { // FIND ONE ARGUMENT

    if (isToken(argument[0])) {
        cc.price(argument[0], CURRENCIES).then(prices => console.log(prices)).catch(console.error)

    } else if (isDate(argument)) {
        const timestamp = new Date(argument[0]);
        let data = [];
        for (let i = 0; i < SYMBOLS.length; i++) {
            data.push(cc.priceHistorical(SYMBOLS[i], CURRENCIES[0], timestamp));
        }
        Promise.all(data).then(prices => {
            var result = {};
            SYMBOLS.forEach((key, i) => result[key] = prices[i]);
            console.log(result);
        }).catch(console.error)

    } else {
        console.log('invalid single token or date');
    }

} else { // INVALID ARGUMENT
    console.log('invalid arguments');
}