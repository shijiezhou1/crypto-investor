# Crypto-Investor

The command line program show how to get all the crypto currencies and convert to different currencies.

## Project setup

Copy link file 
https://s3-ap-southeast-1.amazonaws.com/static.propine.com/transactions.csv.zip

unzip transactions.csv file to `/` project directory.

```
npm install
```

### Given no parameters, return the latest portfolio value per token in USD

```
node index.js
```

### Given a token, return the latest portfolio value for that token in USD

```
node index.js BTC
```

### Given a date, return the portfolio value per token in USD on that date

```
node index.js 1571962653
```

### Given a date and a token, return the portfolio value of that token in USD on that date

```
node index.js 1571962653 BTC
```
