var techanSite = techanSite || {};

(function() {
  'use strict';

  techanSite.data = {
    xcp: { name: 'Counterparty [XCP]' }
  };

  var xcpData = httpGet('https://poloniex.com/public?command=returnChartData&currencyPair=BTC_XCP&period=86400&start='+(Math.round((new Date()).getTime() / 1000)-17280000)+'&end='+(Math.round((new Date()).getTime() / 1000)));
  xcpData = xcpData.replace(/{/g, '[').replace(/}/g, ']');
  xcpData = xcpData.replace(/"date":/g, '').replace(/"high":/g, '').replace(/"low":/g, '').replace(/"open":/g, '').replace(/"close":/g, '').replace(/"volume":/g, '').replace(/"quoteVolume":/g, '').replace(/"weightedAverage":/g, '');

  techanSite.data.xcp.ohlc = mapToStructure(
    JSON.parse(xcpData)
  );

  techanSite.data.xcp.preroll = 1;

  techanSite.data.array = [
    techanSite.data.xcp
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
