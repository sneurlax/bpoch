var data = JSON.parse(httpGet('https://poloniex.com/public?command=returnOrderBook&currencyPair=USDT_BTC&depth=200'));
var asks = mapToStructure(data['asks']);
var bids = mapToStructure(data['bids']);

var cum = 0;
for(var i = 0, len = asks.length; i < len; i++) {
  cum += asks[i].amount;
  asks[i].amount = cum;
  asks[i].sumprice += asks[i].amount*asks[i].price;
}
asks.push({price: asks[asks.length-1].price, amount: 0});
asks.unshift({price: asks[0].price, amount: 0, sumprice: 0});

bids = bids.reverse();

cum = 0;
for(var i = 0, len = bids.length; i < len; i++) {
  cum += bids[i].amount;
  bids[i].amount = cum;
  bids[i].sumprice += bids[i].amount*bids[i].price;
}
bids.push({price: bids[bids.length-1].price, amount: 0, sumprice: 0});
bids.unshift({price: bids[0].price, amount: 0});

bids = bids.reverse();

data = bids.concat(asks);

var margin = {top: 30, right: 20, bottom: 30, left: 50},
  width = 600 - margin.left - margin.right,
  height = 270 - margin.top - margin.bottom;

var svg = d3.select("#depthChart")
         .attr("preserveAspectRatio", "xMinYMin meet")
         .attr("viewBox", "0 0 960 180"),
  margin = {top: 20, right: 20, bottom: 30, left: 50},
  width = +svg.attr("width") - margin.left - margin.right,
  height = +svg.attr("height") - margin.top - margin.bottom,
  g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")"),
  x = d3.scaleTime()
      .rangeRound([0, width]),
  y = d3.scaleLinear()
      .rangeRound([height, 0]);

var line = d3.line()
  .x(function(d) { return x(d.price); })
  .y(function(d) { return y(d.amount); });

x.domain(d3.extent(data, function(d) { return d.price; }));
y.domain(d3.extent(data, function(d) { return d.amount; }));

var xDomain = x.domain();
var yDomain = y.domain();
var xScale = d3.scaleLinear().range([0, width]).domain(x.domain());
var yScale = d3.scaleLinear().range([height, 0]).domain(y.domain());

g.append("path")
  .datum(bids)
  .attr("class", "line")
  .attr("class", "bids")
  .attr("d", line);

g.append("path")
  .datum(asks)
  .attr("class", "line")
  .attr("class", "asks")
  .attr("d", line);

g.append("g")
  .attr("class", "axis axis--x")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x).ticks(20).tickFormat(d3.format(",.0f")))
  .append("text")
  .attr("fill", "#000")
  .attr("x", 70)
  .attr("y", -2)
  .style("text-anchor", "end")
  .text("Price [USDT]")
  .attr("class", "shadow");

g.append("g")
  .attr("class", "axis axis--y")
  .call(d3.axisLeft(y).ticks(10))
  .append("text")
  .attr("fill", "#000")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("x", -height+74)
  .attr("dy", "0.71em")
  .text("Volume [BTC]")
  .attr("class", "shadow");

var focus = g.append("g").style("display", "none");
  
focus.append('line')
  .attr('id', 'focusLineX')
  .attr('class', 'focusLine');
focus.append('line')
  .attr('id', 'focusLineY')
  .attr('class', 'focusLine');

focus.append('rect')
  .attr('id', 'crosshairBackgroundRight')
  .attr('class', 'crosshairBackground')
  .attr('height', 12);
focus.append('rect')
  .attr('id', 'crosshairBackgroundTop')
  .attr('class', 'crosshairBackground')
  .attr('height', 12)
  .attr('y', -4);
focus.append('rect')
  .attr('id', 'crosshairBackgroundBottom')
  .attr('class', 'crosshairBackground')
  .attr('height', 12)
  .attr('y', height-12);

focus.append('text')
  .attr('id', 'volumeTextRight')
  .append("text");
focus.append('text')
  .attr('id', 'priceTextTop')
  .append("text");
focus.append('text')
  .attr('id', 'priceTextBottom')
  .append("text");

var bisectPrice = d3.bisector(function(d) { return d.price; }).left;

g.append('rect')
  .attr('class', 'overlay')
  .attr('width', width)
  .attr('height', height)
  .on('mouseover', function() { focus.style('display', null); })
  .on('mouseout', function() { focus.style('display', 'none'); })
  .on('mousemove', function() { 
    var mouse = d3.mouse(this);
    var mousePrice = xScale.invert(mouse[0]);
    var i = bisectPrice(data, mousePrice);

    var d0 = data[i];
    var d1 = data[i + 1];
    var d = mousePrice - d0.price > d1.price - mousePrice ? d1 : d0;

    var x = xScale(d.price);
    var y = yScale(d.amount);

    var svg = document.getElementById("depthChart");

    focus.select('#focusLineX')
      .attr('x1', x).attr('y1', yScale(yDomain[0]))
      .attr('x2', x).attr('y2', yScale(yDomain[1]));
    focus.select('#focusLineY')
      .attr('x1', xScale(xDomain[0])).attr('y1', y)
      .attr('x2', xScale(xDomain[1])).attr('y2', y);
    var bbox = svg.getElementById("volumeTextRight").getBBox();;
    focus.select('#volumeTextRight')
      .attr('x', width-bbox.width+16)
      .attr('y', y+1)
      .text('Depth: '+d3.format(',.8f')(d.amount)+' BTC');
    var bbox = svg.getElementById("priceTextTop").getBBox();
    focus.select('#priceTextTop')
      .attr('x', x - (bbox.width-8)/2)
      .attr('y', 4)
      .text('Price: $'+d3.format(',.2f')(d.price));
    var bbox = svg.getElementById("priceTextBottom").getBBox();
    focus.select('#priceTextBottom')
      .attr('x', x - (bbox.width-8)/2)
      .attr('y', height-4)
      .text('Sum: $'+d3.format(',.2f')(d.sumprice));

    var bbox = svg.getElementById("volumeTextRight").getBBox();
    focus.select('#crosshairBackgroundRight')
      .attr('x', width - bbox.width + 12)
      .attr('y', y - 8)
      .attr('width', bbox.width+4);
    var bbox = svg.getElementById("priceTextTop").getBBox();
    focus.select('#crosshairBackgroundTop')
      .attr('x', x - (bbox.width+4)/2)
      .attr('width', bbox.width+8);
    var bbox = svg.getElementById("priceTextBottom").getBBox();
    focus.select('#crosshairBackgroundBottom')
      .attr('x', x - (bbox.width+4)/2)
      .attr('width', bbox.width+8);
  });

function mapToStructure(data) {
  return data.map(function(d) {
  return {
    price: d[0],
    amount: Number(+d[1]),
    sumprice: 0
  };
  }).sort(function(a, b) { return d3.ascending(a.price, b.price); });
}

function httpGet(theUrl) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
  xmlHttp.send( null );
  return xmlHttp.responseText;
}
