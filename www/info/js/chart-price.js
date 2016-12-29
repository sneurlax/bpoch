var techanSite = techanSite || {};

techanSite.bigchart = (function(d3, techan) {
  'use strict';

  techanSite.data = {
    btc: { name: 'Bitcoin [BTC]' },
    xmr: { name: 'Monero [XMR]' },
    sdc: { name: 'Shadowcash [SDC]' },
    xcp: { name: 'Counterparty [XCP]' },
    eth: { name: 'Ethereum [ETH]' },
    etc: { name: 'Ethereum Classic [ETC]' }
  };

  var url = window.location.pathname;
  var coin = url.substr(1, 3);

  if( coin == 'xmr' ) {
    var pair = 'BTC_XMR';
  } else if( coin == 'sdc' ) {
    var pair = 'BTC_SDC';
  } else if( coin == 'xcp' ) {
    var pair = 'BTC_XCP';
  } else if( coin == 'eth' ) {
    var pair = 'BTC_ETH';
  } else if( coin == 'etc' ) {
    var pair = 'BTC_ETC';
  } else {
    var pair = 'USDT_BTC';
    coin = 'btc';
  }

  var zoom = getUrlParameter('zoom');
  var start = 0;
  if( !zoom ) {
    start = Math.round((new Date()).getTime() / 1000)-(60*60*24*30.44*6); // 6m default
  } else if( zoom == '6h' ) {
    start = Math.round((new Date()).getTime() / 1000)-(60*60*6);
  } else if( zoom == '1d' ) {
    start = Math.round((new Date()).getTime() / 1000)-(60*60*24);
  } else if( zoom == '2d' ) {
    start = Math.round((new Date()).getTime() / 1000)-(60*60*24*2);
  } else if( zoom == '4d' ) {
    start = Math.round((new Date()).getTime() / 1000)-(60*60*24*4);
  } else if( zoom == '1w' ) {
    start = Math.round((new Date()).getTime() / 1000)-(60*60*24*7);
  } else if( zoom == '2w' ) {
    start = Math.round((new Date()).getTime() / 1000)-(60*60*24*14);
  } else if( zoom == '1m' ) {
    start = Math.round((new Date()).getTime() / 1000)-(60*60*24*30.44);
  } else if( zoom == '3m' ) {
    start = Math.round((new Date()).getTime() / 1000)-(60*60*24*30.44*3);
  } else if( zoom == '6m' ) {
    start = Math.round((new Date()).getTime() / 1000)-(60*60*24*30.44*6);
  } else if( zoom == '1y' ) {
    start = Math.round((new Date()).getTime() / 1000)-(60*60*24*30.44*365.25);
  } else if( zoom == 'all' ) { // these values are the earliest timestamps for which Poloniex has data
    if( coin == 'xmr' ) {
      start = 1400558400;
    } else if( coin == 'sdc' ) {
      start = 1442599200;
    } else if( coin == 'xcp' ) {
      start = 1392487200;
    } else if( coin == 'eth' ) {
      start = 1439049600;
    } else if( coin == 'etc' ) {
      start = 1469347200;
    } else {
      start = 1231028105;
    }
  }

  var end = getUrlParameter('end');
  if( !end ) {
    end = Math.round((new Date()).getTime() / 1000);
  }

  var period = getUrlParameter('period');
  if( !period ) {
    period = 60*60*24;
    if( zoom == '6h' ) {
      period = 60*5;
    } else if( zoom == '1d' ) {
      period = 60*15;
    } else if( zoom == '2d' ) {
      period = 60*30;
    } else if( zoom == '1w' ) {
      period = 60*60*2;
    } else if( zoom == '2w' ) {
      period = 60*60*4;
    }
  } else {
    if( period == '5min' ) {
      period = 60*5;
    } else if( period == '15min' ) {
      period = 60*15;
    } else if( period == '30min' ) {
      period = 60*30;
    } else if( period == '2h' ) {
      period = 60*60*2;
    } else if( period == '4h' ) {
      period = 60*60*4;
    } else if( period == '1d' ) {
      period = 60*60*24;
    }
  }
  if( zoom == '6h' ) {
    period = Math.min(Math.max(period, 60*5), 60*15);
  } else if( zoom == '1d' ) {
    period = Math.min(Math.max(period, 60*5), 60*30);
  } else if( zoom == '2d' ) {
    period = Math.min(Math.max(period, 60*5), 60*60*2);
  } else if( zoom == '1w' ) {
    period = Math.min(Math.max(period, 60*5*2), 60*60*4);
  } else if( zoom == '2w' ) {
    period = Math.min(Math.max(period, 60*5), 60*60*4);
  }

  var Data = httpGet('https://poloniex.com/public?command=returnChartData&currencyPair='+pair+'&period='+period+'&start='+start+'&end='+end);
  Data = Data.replace(/{/g, '[').replace(/}/g, ']');
  Data = Data.replace(/"date":/g, '').replace(/"high":/g, '').replace(/"low":/g, '').replace(/"open":/g, '').replace(/"close":/g, '').replace(/"volume":/g, '').replace(/"quoteVolume":/g, '').replace(/"weightedAverage":/g, '');
  
  if( coin == 'xmr' ) {
    techanSite.data.xmr.ohlc = mapToStructure(JSON.parse(Data));
    techanSite.data.xmr.preroll = 1;
    techanSite.data.array = [techanSite.data.xmr];
  } else if( coin == 'sdc' ) {
    techanSite.data.sdc.ohlc = mapToStructure(JSON.parse(Data));
    techanSite.data.sdc.preroll = 1;
    techanSite.data.array = [techanSite.data.sdc];
  } else if( coin == 'xcp' ) {
    techanSite.data.xcp.ohlc = mapToStructure(JSON.parse(Data));
    techanSite.data.xcp.preroll = 1;
    techanSite.data.array = [techanSite.data.xcp];
  } else if( coin == 'eth' ) {
    techanSite.data.eth.ohlc = mapToStructure(JSON.parse(Data));
    techanSite.data.eth.preroll = 1;
    techanSite.data.array = [techanSite.data.eth];
  } else if( coin == 'etc' ) {
    techanSite.data.etc.ohlc = mapToStructure(JSON.parse(Data));
    techanSite.data.etc.preroll = 1;
    techanSite.data.array = [techanSite.data.etc];
  } else {
    techanSite.data.btc.ohlc = mapToStructure(JSON.parse(Data));
    techanSite.data.btc.preroll = 1;
    techanSite.data.array = [techanSite.data.btc];
  }

  function BigChart(market) {

    var dim = {
      width: null, height: null,
      margin: { top: 25, right: 50, bottom: 25, left: 50 },
      plot: { width: null, height: null },
      ohlc: { height: null }
    };

    var data = market.ohlc,
        x = techan.scale.financetime(),
        y = d3.scaleLinear(),
        yPercent = y.copy(),
        yVolume = d3.scaleLinear(),
        candlestick = techan.plot.candlestick().xScale(x).yScale(y),
        volume = techan.plot.volume().accessor(candlestick.accessor()).xScale(x).yScale(yVolume),
        xAxis = d3.axisBottom(x),
        xAxisTop = d3.axisTop(x),
        timeAnnotation = techan.plot.axisannotation().orient('bottom').axis(xAxis).format(d3.timeFormat('%Y-%m-%d')).width(65),
        timeAnnotationTop = techan.plot.axisannotation().orient('top').axis(xAxisTop).format(d3.timeFormat('%Y-%m-%d')).width(65),
        yAxis = d3.axisRight(y),
        percentAxis = d3.axisLeft(yPercent).tickFormat(d3.format('+.1%')),
        percentAnnotation = techan.plot.axisannotation().orient('right').axis(percentAxis),
        volumeAxis = d3.axisLeft(yVolume).ticks(3).tickFormat(d3.format(',.3s')),
        volumeAnnotation = techan.plot.axisannotation().orient('right').axis(volumeAxis).width(35);

    if(market.name == 'Bitcoin [BTC]') {
      var ohlcAnnotation = techan.plot.axisannotation().orient('right').axis(yAxis).format(d3.format(',.2f')),
          closeAnnotation = techan.plot.axisannotation().orient('right').accessor(candlestick.accessor()).axis(yAxis).format(d3.format(',.2f'));
    } else {
      var ohlcAnnotation = techan.plot.axisannotation().orient('right').axis(yAxis).format(d3.format(',.8f')),
          closeAnnotation = techan.plot.axisannotation().orient('right').accessor(candlestick.accessor()).axis(yAxis).format(d3.format(',.8f'));
    }

    var ohlcCrosshair = techan.plot.crosshair().xScale(x).yScale(y).xAnnotation([timeAnnotation, timeAnnotationTop]).yAnnotation([ohlcAnnotation, percentAnnotation, volumeAnnotation]);

    function bigchart(selection) {
      var svg = selection.append("svg"),
          defs = svg.append("defs");

      defs.append("clipPath")
          .attr("id", "ohlcClip")
        .append("rect")
          .attr("x", 0)
          .attr("y", 0);

      defs.append("clipPath")
          .attr("id", "volumeClip")
        .append("rect")
          .attr("x", 0)
          .attr("y", 0);

      svg.append('text')
          .attr("class", "version")
          .style("text-anchor", "end")
          .text("Data from Poloniex");

      svg = svg.append("g")
        .attr("class", "chart")
        .attr("transform", "translate(" + dim.margin.left + "," + dim.margin.top + ")");

      svg.append("g")
        .attr("class", "x axis bottom");

      svg.append("g")
        .attr("class", "x axis top");

      var ohlcSelection = svg.append("g")
        .attr("class", "ohlc")
        .attr("transform", "translate(0,0)");

      ohlcSelection.append("g")
          .attr("class", "y axis");

      ohlcSelection.append("g")
        .attr("class", "closeValue annotation up");

      ohlcSelection.append("g")
        .attr("class", "volume")
        .attr("clip-path", "url(#volumeClip)");

      ohlcSelection.append("g")
        .attr("class", "candlestick")
        .attr("clip-path", "url(#ohlcClip)");

      ohlcSelection.append("g")
        .attr("class", "percent axis");

      ohlcSelection.append("g")
        .attr("class", "volume axis");

      // Add trendlines and other interactions last to be above zoom pane
      svg.append('g')
        .attr("class", "crosshair ohlc");

      var accessor = candlestick.accessor(),
          postRollData = data.slice(market.preroll);

      x.domain(techan.scale.plot.time(data).domain());
      y.domain(techan.scale.plot.ohlc(postRollData).domain());
      yPercent.domain(techan.scale.plot.percent(y, accessor(data[market.preroll])).domain());
      yVolume.domain(techan.scale.plot.volume(postRollData).domain());

      resize(selection);

      svg.select("g.candlestick").datum(data).call(candlestick);
      svg.select("g.closeValue.annotation").datum([data[data.length-1]]).call(closeAnnotation);
      svg.select("g.volume").datum(data).call(volume);

      svg.select("g.crosshair.ohlc").call(ohlcCrosshair);

      svg.append('text')
        .attr("class", "symbol")
        .attr("x", 5)
        .attr("y", 15)
        .attr("class", "shadow")
        .text(market.name);

      selection.call(draw);
    }

    bigchart.resize = function(selection) {
      selection.call(resize).call(draw);
    };

    function resize(selection) {
      dim.width = selection.node().clientWidth;
      dim.height = selection.node().clientHeight;
      dim.plot.width = dim.width - dim.margin.left - dim.margin.right;
      dim.plot.height = dim.height - dim.margin.top - dim.margin.bottom;
      dim.ohlc.height = dim.plot.height * 0.85;

      var xRange = [0, dim.plot.width],
          yRange = [dim.ohlc.height, 0],
          ohlcVerticalTicks = Math.min(10, Math.round(dim.height/70)),
          xTicks = Math.min(10, Math.round(dim.width/130));

      x.range(xRange);
      xAxis.ticks(xTicks);
      xAxisTop.ticks(xTicks);
      y.range(yRange);
      yAxis.ticks(ohlcVerticalTicks);
      yPercent.range(y.range());
      percentAxis.ticks(ohlcVerticalTicks);
      yVolume.range([dim.plot.height, dim.plot.height*0.85]);
      volumeAxis.ticks(Math.min(3, Math.round(dim.height/150)));
      timeAnnotation.translate([0, dim.plot.height]);
      ohlcAnnotation.translate([xRange[1], 0]);
      closeAnnotation.translate([xRange[1], 0]);
      ohlcCrosshair.verticalWireRange([0, dim.plot.height]);

      selection.select("svg")
        .attr("width", dim.width)
        .attr("height", dim.height);

      selection.select("text.version")
          .attr("x", dim.width-50)
          .attr("y", dim.height);

      selection.selectAll("defs #ohlcClip > rect")
        .attr("width", dim.plot.width)
        .attr("height", dim.ohlc.height);

      selection.selectAll("defs #volumeClip > rect")
        .attr("width", dim.plot.width)
        .attr("height", dim.plot.height);

      selection.select("g.x.axis.bottom")
        .attr("transform", "translate(0," + dim.plot.height + ")");

      selection.select("g.ohlc g.y.axis")
        .attr("transform", "translate(" + xRange[1] + ",0)");
    }

    function draw(selection) {
      var svg = selection.select("svg");
      svg.select("g.x.axis.bottom").call(xAxis);
      svg.select("g.x.axis.top").call(xAxisTop);
      svg.select("g.ohlc .axis").call(yAxis);
      svg.select("g.volume.axis").call(volumeAxis);
      svg.select("g.percent.axis").call(percentAxis);

      // We know the data does not change, a simple refresh that does not perform data joins will suffice.
      svg.select("g.candlestick").call(candlestick.refresh);
      svg.select("g.closeValue.annotation").call(closeAnnotation.refresh);
      svg.select("g.volume").call(volume.refresh);
      svg.select("g.crosshair.ohlc").call(ohlcCrosshair.refresh);
    }

    return bigchart;
  }

  return BigChart(techanSite.data[coin]);

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
}(d3, techan));

function httpGet(theUrl) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
  xmlHttp.send( null );
  return xmlHttp.responseText;
}

function getUrlParameter(sParam) {
  var sPageURL = decodeURIComponent(window.location.search.substring(1)),
      sURLVariables = sPageURL.split(new RegExp('[\?&]')),
      sParameterName,
      i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0].toLowerCase() === sParam.toLowerCase()) {
      return sParameterName[1] === undefined ? true : sParameterName[1];
    }
  }

  return false;
};

function valBetweenAltMin(val, min, max) {
  return (val > min) ? ((val < max) ? val : max) : min;
}

function addOrUpdateUrlParam(name, value) {
  var href = window.location.href;
  var regex = new RegExp("[&\\?]" + name + "=");
  if(regex.test(href)) {
    regex = new RegExp("([&\\?])" + name + "=*(.+)(\\&)?");
    window.location.href = href.replace(regex, "$1" + name + "=" + value);
  } else {
    if(href.indexOf("?") > -1)
      window.location.href = href + "&" + name + "=" + value;
    else
      window.location.href = href + "?" + name + "=" + value;
  }
}
