var techanSite = techanSite || {};

(function() {
  'use strict';

  techanSite.data = {
    etc: { name: 'Ethereum Classic [ETC]' }
  };

  var etcData = httpGet('https://poloniex.com/public?command=returnChartData&currencyPair=BTC_ETC&period=86400&start='+(Math.round((new Date()).getTime() / 1000)-17280000)+'&end='+(Math.round((new Date()).getTime() / 1000)));
  etcData = etcData.replace(/{/g, '[').replace(/}/g, ']');
  etcData = etcData.replace(/"date":/g, '').replace(/"high":/g, '').replace(/"low":/g, '').replace(/"open":/g, '').replace(/"close":/g, '').replace(/"volume":/g, '').replace(/"quoteVolume":/g, '').replace(/"weightedAverage":/g, '');

  techanSite.data.etc.ohlc = mapToStructure(
    JSON.parse(etcData)
  );

  techanSite.data.etc.preroll = 1;

  techanSite.data.array = [
    techanSite.data.etc
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
