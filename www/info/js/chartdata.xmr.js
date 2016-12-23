var techanSite = techanSite || {};

(function() {
  'use strict';

  techanSite.data = {
    xmr: { name: "Monero" }
  };

  var xmrData = httpGet('https://poloniex.com/public?command=returnChartData&currencyPair=BTC_XMR&period=86400&start='+(Math.round((new Date()).getTime() / 1000)-17280000)+'&end='+(Math.round((new Date()).getTime() / 1000)));
  xmrData = xmrData.replace(/{/g, '[').replace(/}/g, ']');
  xmrData = xmrData.replace(/"date":/g, '').replace(/"high":/g, '').replace(/"low":/g, '').replace(/"open":/g, '').replace(/"close":/g, '').replace(/"volume":/g, '').replace(/"quoteVolume":/g, '').replace(/"weightedAverage":/g, '');

  techanSite.data.xmr.ohlc = mapToStructure(
    JSON.parse(xmrData)
  );

  techanSite.data.xmr.preroll = 1;

  techanSite.data.array = [
    techanSite.data.xmr
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
