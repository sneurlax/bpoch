var techanSite = techanSite || {};

techanSite.depthchart = (function(d3, techan) {
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

  var depth = getUrlParameter('depth');
  if( !depth ) {
    if( coin == 'xmr' ) {
      depth = 2000;
    } else if( coin == 'sdc' ) {
      depth = 300;
    } else if( coin == 'xcp' ) {
      depth = 200;
    } else if( coin == 'eth' ) {
      depth = 1000;
    } else if( coin == 'etc' ) {
      depth = 500;
    } else {
      depth = 100;
    }
  }

  var Data = JSON.parse(httpGet('https://poloniex.com/public?command=returnOrderBook&currencyPair='+pair+'&depth='+depth));
  var asks = mapToStructure(Data['asks']);
  var bids = mapToStructure(Data['bids']);

  var cum = 0;
  for(var i = 0, len = asks.length; i < len; i++) {
    cum += asks[i].amount;
    asks[i].amount = cum;
    asks[i].sumprice += asks[i].amount*asks[i].price;
  }
  asks.push({price: asks[asks.length-1].price, amount: 0, sumprice: 0});
  asks.unshift({price: asks[0].price, amount: 0, sumprice: 0});

  bids = bids.reverse();

  cum = 0;
  for(var i = 0, len = bids.length; i < len; i++) {
    cum += bids[i].amount;
    bids[i].amount = cum;
    bids[i].sumprice += bids[i].amount*bids[i].price;
  }
  bids.push({price: bids[bids.length-1].price, amount: 0, sumprice: 0});
  bids.unshift({price: bids[0].price, amount: 0, sumprice: 0});

  bids = bids.reverse();

  if( coin == 'xmr' ) {
    techanSite.data.xmr.depth = bids.concat(asks);
  } else if( coin == 'sdc' ) {
    techanSite.data.sdc.depth = bids.concat(asks);
  } else if( coin == 'xcp' ) {
    techanSite.data.xcp.depth = bids.concat(asks);
  } else if( coin == 'eth' ) {
    techanSite.data.eth.depth = bids.concat(asks);
  } else if( coin == 'etc' ) {
    techanSite.data.etc.depth = bids.concat(asks);
  } else {
    techanSite.data.btc.depth = bids.concat(asks);
  }

  function DepthChart(market) {

    var dim = {
      width: $("#depthChart").width(), height: $("#depthChart").height(),
      margin: { top: 25, right: 50, bottom: 25, left: 50 },
      plot: { width: null, height: null }
    };

    var data = market.depth,
        x = d3.scaleLinear(),
        y = d3.scaleLinear(),
        xPrice = d3.extent(data, function(d) { return d.price; }),
        xSum = [-data[data.length-2].sumprice, data[1].sumprice],
        yVolume = d3.extent(data, function(d) { return d.amount; }),
        xAxis = d3.axisBottom(x).scale(d3.scaleLinear().domain(xPrice).range([0, dim.width-dim.margin.left-dim.margin.right])),
        xAxisTop = d3.axisTop(x).scale(d3.scaleLinear().domain(xSum.reverse()).range([0, dim.width-dim.margin.left-dim.margin.right])),
        yAxis = d3.axisLeft(y).scale(d3.scaleLinear().domain(yVolume.reverse()).range([0, 100]));

    if(market.name == 'Bitcoin [BTC]') {
      var priceAnnotation = techan.plot.axisannotation().orient('bottom').axis(xAxis).format(d3.format('$,.2f')).width((xPrice[1].length+1)*3+8),
          sumAnnotation = techan.plot.axisannotation().orient('top').axis(xAxisTop).format(function(d) { return 'Sum: '+d3.format("$,.2f")(Math.abs(d)); }).width(80),
          depthAnnotation = techan.plot.axisannotation().orient('right').axis(yAxis).format(function(d) { return d3.format(",.8f")(d)+' '+coin.toUpperCase(); }).width(90);
    } else {
      var priceAnnotation = techan.plot.axisannotation().orient('bottom').axis(xAxis).format(function(d) { return d3.format(",.8f")(d)+' BTC'; }).width(82),
          sumAnnotation = techan.plot.axisannotation().orient('top').axis(xAxisTop).format(function(d) { return 'Sum: '+d3.format(",.8f")(Math.abs(d))+' BTC'; }).width(120),
          depthAnnotation = techan.plot.axisannotation().orient('right').axis(yAxis).format(function(d) { return d3.format(",.8f")(d)+' '+coin.toUpperCase(); }).width(102);
    }
    
    var depthCrosshair = techan.plot.crosshair().xScale(x).yScale(y).xAnnotation([sumAnnotation, priceAnnotation]).yAnnotation([depthAnnotation]);

    function depthchart(selection) {
      var svg = selection.append("svg"),
          defs = svg.append("defs"),
          width = dim.width - dim.margin.left - dim.margin.right,
          height = dim.height + dim.margin.bottom,
          x = d3.scaleLinear()
              .range([0, width]),
          y = d3.scaleLinear()
              .range([height, 0]),
          line = d3.line()
                .x(function(d) { return x(d.price); })
                .y(function(d) { return y(d.amount); });

      defs.append("clipPath")
          .attr("id", "depthClip")
        .append("rect")
          .attr("x", 0)
          .attr("y", 0);

      svg = svg.append("g")
        .attr("class", "chart")
        .attr("transform", "translate(" + dim.margin.left + "," + dim.margin.top + ")");

      svg.append("g")
        .attr("class", "y axis left");

      svg.append("g")
        .attr("class", "x axis bottom");

      svg.append("g")
        .attr("class", "x axis top");

      x.domain(d3.extent(data, function(d) { return d.price; }));
      y.domain(d3.extent(data, function(d) { return d.amount; }));

      var xScale = d3.scaleLinear().range([0, width]).domain(x.domain()),
          yScale = d3.scaleLinear().range([height, 0]).domain(y.domain());

      svg.append("path")
        .datum(bids)
        .attr("class", "line")
        .attr("class", "bids")
        .attr("id", "bids")
        .attr("d", line);

      svg.append("path")
        .datum(asks)
        .attr("class", "line")
        .attr("class", "asks")
        .attr("id", "asks")
        .attr("d", line);

      svg.append("g")
        .attr("class", "price annotation up");

      resize(selection);

      svg.append('g')
        .attr("class", "crosshair depth");

      svg.select("g.sum.annotation").datum(data).call(sumAnnotation);
      svg.select("g.price.annotation").datum(data).call(priceAnnotation);
      svg.select("g.crosshair.depth").call(depthCrosshair);

      selection.call(draw);
    }

    depthchart.resize = function(selection) {
      selection.call(resize).call(draw);
    };

    function resize(selection) {
      dim.width = selection.node().clientWidth;
      dim.height = selection.node().clientHeight;
      dim.plot.width = dim.width - dim.margin.left - dim.margin.right;
      dim.plot.height = dim.height - dim.margin.top - dim.margin.bottom;

      var xRange = [0, dim.plot.width],
          yRange = [dim.plot.height, 0],
          yTicks = Math.min(30, Math.round(dim.height/15)),
          xTicks = Math.min(20, Math.round(dim.width/100));

      x.range(xRange);
      xAxis.ticks(xTicks);
      y.range(yRange);
      yAxis.ticks(yTicks);
      priceAnnotation.translate([0, yRange[0]]);
      depthCrosshair.verticalWireRange([0, dim.plot.height]);

      selection.select("svg")
        .attr("width", dim.width)
        .attr("height", dim.height);

      selection.selectAll("defs #depthClip > rect")
        .attr("width", dim.plot.width)
        .attr("height", dim.plot.height);

      selection.select("g.x.axis")
        .attr("transform", "translate(0, " + dim.plot.height + ")");

      selection.selectAll("defs .plotClip > rect")
        .attr("width", dim.plot.width)
        .attr("height", dim.plot.height);
    }

    function draw(selection) {
      var svg = selection.select("svg");
      svg.select("g.x.axis").call(xAxis);
      svg.select("g.y.axis").call(yAxis);

      /*
      // We know the data does not change, a simple refresh that does not perform data joins will suffice.
      svg.select("g.candlestick").call(candlestick.refresh);
      svg.select("g.volume").call(volume.refresh);
      */
      svg.select("g.price.annotation").call(priceAnnotation.refresh);
      svg.select("g.crosshair.depth").call(depthCrosshair.refresh);
    }

    return depthchart;
  }

  return DepthChart(techanSite.data[coin]);

  function mapToStructure(data) {
    return data.map(function(d) {
      return {
        price: d[0],
        amount: Number(+d[1]),
        sumprice: 0
      };
    }).sort(function(a, b) { return d3.ascending(a.price, b.price); });
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
