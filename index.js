const rp = require('request-promise');
const config = require('./config');
const plotly = require('plotly')(config.plotly.username, config.plotly.apiKey);


const fetchSingleDayStockPrices = (ticker, date, transform) => {
    //https://iextrading.com/developer/docs/#chart
    //only trailing 30 days
    //9:30AM to 3:59PM
    return rp({
        method: 'GET',
        json: true,
        uri: `https://api.iextrading.com/1.0/stock/${ticker}/chart/date/${date}`,
        transform: transform
    })
};
const convertToDate = (dateStr) => {
    return dateStr.substr(0, 4) + '-' + dateStr.substr(4, 2) + '-' + dateStr.substr(6, 2);
}
const convertIEXToPlotly = (data) => {
    let result = [
        {
            type: 'scatter',
            x: [],
            y: []
        }
    ];
    for (let i = 0; i < data.length; i++) {
        const dateTime = convertToDate(data[i].date) + ' ' + data[i].minute + ':00';
        const stockPrice = data[i].low;
        result[0].x.push(dateTime);
        result[0].y.push(stockPrice);
    }
    return result;
};
const plotData = (data) => {
    return new Promise((resolve, reject) => {
        //https://plot.ly/organize/home/
        var graphOptions = { filename: "stock-price", fileopt: "overwrite" };
        plotly.plot(data, graphOptions, function (err, msg) {
            if (err) {
                reject(err);
            }
            //console.log(msg);
            resolve(msg);
        });

    });
}
const runSim = (data)=>{
    const targetBuyPrice = 186;
    const targetSellPrice = 188.50;
    for(let i = 0; i < data.length; i++){
        if(data[i] < targetBuyPrice){
            console.log('Bought it! ' + data[i]);
        }
        if(data[i] > targetSellPrice){
            console.log('Sold it! ' + data[i]);
        }
        i+=4;//every 5 minutes
    }
}
const main = async () => {
    try {
        const data = await fetchSingleDayStockPrices('aapl', '20190410', convertIEXToPlotly);
        //await plotData(data);
        runSim(data[0].y);
    }
    catch (err) {
        console.log(err);
    }
};
main();

/*https://docs.quandl.com/docs/parameters-2
const result = await rp({
    method:'GET',
    json: true,
    uri:`https://www.quandl.com/api/v3/datasets/EOD/AAPL.json`,
    qs:{
        api_key: config.stocksApiKey,
        start_date: '2019-02-04',
        end_date: '2019-02-05',
        order: 'asc',

    }
});
*/