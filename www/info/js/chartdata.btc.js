var techanSite = techanSite || {};

(function() {
  'use strict';

  techanSite.data = {
    btc: { name: 'Bitcoin [BTC]' }
  };

  var btcData = httpGet('https://poloniex.com/public?command=returnChartData&currencyPair=USDT_BTC&period=86400&start='+(Math.round((new Date()).getTime() / 1000)-17280000)+'&end='+(Math.round((new Date()).getTime() / 1000)));
  btcData = btcData.replace(/{/g, '[').replace(/}/g, ']');
  btcData = btcData.replace(/"date":/g, '').replace(/"high":/g, '').replace(/"low":/g, '').replace(/"open":/g, '').replace(/"close":/g, '').replace(/"volume":/g, '').replace(/"quoteVolume":/g, '').replace(/"weightedAverage":/g, '');
  
  techanSite.data.btc.ohlc = mapToStructure(
    JSON.parse(btcData)
  );

  techanSite.data.btc.preroll = 1;

  techanSite.data.array = [
    techanSite.data.btc
  ];

  function mapToStructure(data) {
    return data.map(function(d) {
      return {
        date: new Date(d[0]*1000),
        open: +d[3],
        high: +d[1],
        low: +d[2],
        close: +d[4],
        volume: +d[5]
      };
    }).sort(function(a, b) { return d3.ascending(a.date, b.date); });
  }
 }());

function httpGet(theUrl) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
  xmlHttp.send( null );
  return xmlHttp.responseText;
}
