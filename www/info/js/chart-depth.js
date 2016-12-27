var data = JSON.parse(httpGet('https://poloniex.com/public?command=returnOrderBook&currencyPair=USDT_BTC&depth=100'));
var asks = mapToStructure(data['asks']);
var bids = mapToStructure(data['bids']);

var cum = 0;
for(var i = 0, len = asks.length; i < len; i++) {
  cum += asks[i].amount;
  asks[i].amount = cum;
}
asks.push({price: asks[asks.length - 1].price, amount: 0});

cum = 0;
for(var len = bids.length, i = len-1; i > -1; i--) {
  cum += bids[i].amount;
  bids[i].amount = cum;
}
bids.push({price: bids[bids.length - 1].price, amount: 0});

data = bids.concat(asks);
console.log(data);

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

x.domain(d3.extent(data, function(d) { return d.price; }));
y.domain(d3.extent(data, function(d) { return d.amount; }));

var xDomain = x.domain();
var yDomain = y.domain();
var xScale = d3.scaleLinear().range([0, width]).domain(x.domain());
var yScale = d3.scaleLinear().range([height, 0]).domain(y.domain());

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

var focus = g.append("g").style("display", "none");
    
focus.append('line')
    .attr('id', 'focusLineX')
    .attr('class', 'focusLine');
focus.append('line')
    .attr('id', 'focusLineY')
    .attr('class', 'focusLine');

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

        focus.select('#focusLineX')
            .attr('x1', x).attr('y1', yScale(yDomain[0]))
            .attr('x2', x).attr('y2', yScale(yDomain[1]));
        focus.select('#focusLineY')
            .attr('x1', xScale(xDomain[0])).attr('y1', y)
            .attr('x2', xScale(xDomain[1])).attr('y2', y);
    });

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
