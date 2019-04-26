# automated-stock-strategy-back-testing

## Plan
- gather historical stock data
- stock data must be a minimum interval of 1 minute
- create framework to test different stock strategy across time in order to see gains/losses
- future: deploy automated trading bot with stock strategy


## Contents so far
- quick node.js app to save data from iex trading api
    - iex trading only has last trailing 30 days 
    - tickers currently saving data for: ['aapl','tsla','amzn','fb','msft','cgc','cron','nflx','wmt']
- plotly
    - used for graphing data

