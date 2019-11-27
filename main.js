let fs = require('fs'),
    es = require('event-stream');

global.fetch = require('node-fetch')
const Spinner = require('cli-spinner').Spinner;
const argv = require('optimist').argv;
const argument = argv._;
const cc = require('cryptocompare');
cc.setApiKey('2605c530c671f9c3ee1b94ca290d354b85d998dcdf43fc1e8349a44aa9b7f6f1')

const csvFile = 'transactions.csv'; // name of the csv file
let lineNr = 0;
let CURRENCIES = ['USD'];
let SYMBOLS = ['BTC', 'ETH', 'XRP'];
let LOADSTREAM = fs.createReadStream(csvFile)
    .pipe(es.split());
let tokenObj = {};
let tokenSelected = null;
let dateSelected = null;

let spinner = new Spinner('processing.. %s');
spinner.setSpinnerString('|/-\\');
spinner.start();
console.time('estimate time:')
console.log('CURRENT ARGUMENTS:', argument);

let currentAmount,
    currentTransactionType,
    currentToken,
    transaction;

let loadPipe = es.map(function (data, callback) {
    if (data && lineNr > 0) {                           // filter undefined or null row and header
        const currentRow = data.split(",")
        currentTimestamp = currentRow[0];               // CURRENT TIMESTAMP
        currentTransactionType = currentRow[1];         // DEPOSIT or WITHDRAWALS
        currentToken = currentRow[2];                   // BTC, ETH, XRP
        currentAmount = parseFloat(currentRow[3]);      // 0.00000000......
        transaction = currentTransactionType == "DEPOSIT" ? +1 : -1;

        const calculate = () => {
            if (tokenObj.hasOwnProperty(currentToken)) {    // if the key duplicate, add the old amount
                tokenObj[currentToken] = tokenObj[currentToken] + transaction * currentAmount;
            } else {
                // insert this token and amount to the token Obj
                tokenObj[currentToken] = parseFloat(transaction * currentAmount)
            }
        }

        if (dateSelected) {
            if (currentTimestamp <= dateSelected) {
                calculate();
            }
        } else {
            calculate();
        }

    } else if (!data) { // delete empty line
        lineNr--;
    }
    lineNr++;
    callback(null, tokenObj) // return tokenObj after on end
})

/**
 * trigger the streams to load the files
 * it can take a long time basic on the file size. 
 * 1GB file may take 40 seconds.
 * 
 */
function loadPipeResult() {
    LOADSTREAM.pipe(loadPipe).on('end', function () {
        console.timeEnd('estimate time:')
        if (tokenSelected) {
            calculateExchangeRateUSD(tokenObj, tokenSelected);
        } else {
            calculateExchangeRateUSD(tokenObj);
        }
        spinner.stop();
    })
}

/**
 * Check the token is the validate string
 * 
 * @param {String} arg 
 */
function isToken(arg) { // CHECK IF TOKE IS VALID e.g. BTC etc
    if (arg.toString().length > 3) return false;
    return SYMBOLS.some(r => arg.indexOf(r) >= 0) ? true : false
}

/**
 * Check if the variable is a valid datae
 * 
 * @param {Number} arg 
 */
function isTimestamps(arg) {
    return (new Date(arg)).getTime() > 0 ? true : false;

}

/**
 * 
 * Calculate all the coins and the prices in USD
 * 
 * @param {object} result 
 * @param {string} token 
 */
function calculateExchangeRateUSD(result, token = "") {
    cc.priceMulti(Object.keys(result), CURRENCIES).then(prices => {
        let btcPrice = prices.BTC.USD;
        let ethPrice = prices.ETH.USD;
        let xrpPrice = prices.XRP.USD;

        if (token != "") {
            let aCoinPrice = prices[token].USD;
            console.log({ [token]: { "USD": aCoinPrice * result.BTC } });
        } else {
            console.log({ "BTC": { "USD": btcPrice * result.BTC } });
            console.log({ "ETH": { "USD": ethPrice * result.ETH } });
            console.log({ "XRP": { "USD": xrpPrice * result.XRP } });
        }
    }).catch(console.error)
}

// PARSE COMMAND 
if (argument.length < 1) { // FIND NO ARGUMENTS
    loadPipeResult();
} else if (argument.length == 2) { // FIND TWO ARGUMENTS
    if (isTimestamps(argument[0]) && isToken(argument[1])) {

        dateSelected = argument[0]
        tokenSelected = argument[1]
        loadPipeResult();
    } else {
        console.log('invalid toke or date enter: e.g. 1571962653 BTC');
    }

} else if (argument.length == 1) { // FIND ONE ARGUMENT
    if (isToken(argument[0])) {
        tokenSelected = argument[0];
        loadPipeResult();
    } else if (isTimestamps(argument[0])) {
        dateSelected = argument[0];
        loadPipeResult();
    } else {
        console.log('invalid single token or date');
    }

} else { // INVALID ARGUMENT
    console.log('invalid arguments');
}