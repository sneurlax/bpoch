var techanSite = techanSite || {};

(function() {
  'use strict';

  techanSite.data = {
    sdc: { name: "Shadowcash" }
  };

  var sdcData = httpGet('https://poloniex.com/public?command=returnChartData&currencyPair=BTC_SDC&period=86400&start='+(Math.round((new Date()).getTime() / 1000)-17280000)+'&end='+(Math.round((new Date()).getTime() / 1000)));
  sdcData = sdcData.replace(/{/g, '[').replace(/}/g, ']');
  sdcData = sdcData.replace(/"date":/g, '').replace(/"high":/g, '').replace(/"low":/g, '').replace(/"open":/g, '').replace(/"close":/g, '').replace(/"volume":/g, '').replace(/"quoteVolume":/g, '').replace(/"weightedAverage":/g, '');

  techanSite.data.sdc.ohlc = mapToStructure(
    JSON.parse(sdcData)
  );

  techanSite.data.sdc.preroll = 1;

  techanSite.data.array = [
    techanSite.data.sdc
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
