var techanSite = techanSite || {};

(function() {
  'use strict';

  techanSite.data = {
    eth: { name: "Ethereum" }
  };

  var ethData = httpGet('https://poloniex.com/public?command=returnChartData&currencyPair=BTC_ETH&period=86400&start='+(Math.round((new Date()).getTime() / 1000)-17280000)+'&end='+(Math.round((new Date()).getTime() / 1000)));
  ethData = ethData.replace(/{/g, '[').replace(/}/g, ']');
  ethData = ethData.replace(/"date":/g, '').replace(/"high":/g, '').replace(/"low":/g, '').replace(/"open":/g, '').replace(/"close":/g, '').replace(/"volume":/g, '').replace(/"quoteVolume":/g, '').replace(/"weightedAverage":/g, '');

  techanSite.data.eth.ohlc = mapToStructure(
    JSON.parse(ethData)
  );

  techanSite.data.eth.preroll = 1;

  techanSite.data.array = [
    techanSite.data.eth
  ];

  function mapToStructure(data) {
    return data.map(function(d) {
      return {
        date: d[0],
        open: +d[3],
        high: +d[1],
        low: +d[2],
        close: +d[4],
        volume: +d[5]
      };
    })
  }
 }());

function httpGet(theUrl) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
  xmlHttp.send( null );
  return xmlHttp.responseText;
}
