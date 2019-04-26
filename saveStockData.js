const rp = require('request-promise');
const fs = require('fs');
const moment = require('moment');
const fetchSingleDayStockPrices = (ticker, date) => {
    //https://iextrading.com/developer/docs/#chart
    //only trailing 30 days
    //9:30AM to 3:59PM
    return rp({
        method: 'GET',
        json: true,
        uri: `https://api.iextrading.com/1.0/stock/${ticker}/chart/date/${date}`
    })
};
const getDataForTicker = async (ticker, date) => {
    try {
        const jsonData = await fetchSingleDayStockPrices(ticker, date);
        const jsonContent = JSON.stringify(jsonData);
        fs.writeFile(`./data/${ticker}_${date}.json`, jsonContent, 'utf8', function (err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                return console.log(err);
            }
            console.log("JSON file has been saved.");
        });
    }
    catch (err) {
        console.log(err);
    }
}
const getLast30Days = async (ticker, singleDay=false) => {
    let todaysDate = moment();
    let days = 0;
    while (days < 31) {
        const dateStr = todaysDate.format('L');
        const date = dateStr.substr(6, 4) + dateStr.substr(0, 2) +  dateStr.substr(3, 2);//YYYYMMDD
        await getDataForTicker(ticker,date);
        todaysDate.subtract(1, 'days');
        days++;
        if(singleDay){
            days = 100;
        }
    }
};
const main = async () => {
    try {
        const tickers = ['aapl','tsla','amzn','fb','msft','cgc','cron','nflx','wmt'];
        for (let i = 0; i < tickers.length; i++) {
            await getLast30Days(tickers[i]);
            // await getLast30Days(tickers[i],true);//could pass num days instead of true false
            console.log('completed: ' + tickers[i]);
        }
    }
    catch (err) {
        console.log(err);
    }
}
main();