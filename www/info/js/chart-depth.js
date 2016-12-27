var data = JSON.parse(httpGet('https://poloniex.com/public?command=returnOrderBook&currencyPair=USDT_BTC&depth=100'));
var bids = mapToStructure(data['bids']);
var asks = mapToStructure(data['asks']);

var cum = 0;
for(var len = bids.length, i = len-1; i > -1; i--) {
  cum += bids[i].amount;
  bids[i].amount = cum;
}

cum = 0;
for(var i = 0, len = asks.length; i < len; i++) {
  cum += asks[i].amount;
  asks[i].amount = cum;
}

data = bids.reverse().concat(asks);

// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 20, bottom: 30, left: 50},
    width = 600 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom;

var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleTime()
    .rangeRound([0, width]);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var line = d3.line()
    .x(function(d) { return x(d.price); })
    .y(function(d) { return y(d.amount); });

// Set the ranges
x.domain(d3.extent(data, function(d) { return d.price; }));
y.domain(d3.extent(data, function(d) { return d.amount; }));

g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

g.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(y))
  .append("text")
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .style("text-anchor", "end")
    .text("Volume [BTC]");

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

function mapToStructure(data) {
  return data.map(function(d) {
    return {
      price: d[0],
      amount: Number(+d[1])
    };
  }).sort(function(a, b) { return d3.ascending(a.price, b.price); });
}

function httpGet(theUrl) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
  xmlHttp.send( null );
  return xmlHttp.responseText;
}
