var techanSite = techanSite || {};

techanSite.bigchart = (function(d3, techan) {
  'use strict';

  function BigChart(stock) {

    var dim = {
      width: null, height: null,
      margin: { top: 25, right: 50, bottom: 25, left: 50 },
      plot: { width: null, height: null },
      ohlc: { height: null },
      indicator: { height: null, padding: null, top: null, bottom: null }
    };

    var data = stock.ohlc,
        x = techan.scale.financetime(),
        y = d3.scaleLinear(),
        yPercent = y.copy(),
        indicatorTop = d3.scaleLinear(),
        yVolume = d3.scaleLinear(),
        candlestick = techan.plot.candlestick().xScale(x).yScale(y),
        sma0 = techan.plot.sma().xScale(x).yScale(y),
        sma1 = techan.plot.sma().xScale(x).yScale(y),
        ema2 = techan.plot.ema().xScale(x).yScale(y),
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

    if(stock.name == 'Bitcoin [BTC]') {
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

      defs.selectAll(".indicatorClip").data([0, 1])
        .enter()
        .append("clipPath")
          .attr("id", function(d, i) { return "indicatorClip-" + i; })
          .attr("class", "indicatorClip")
        .append("rect")
          .attr("x", 0);

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
          indicatorPreRoll = stock.preroll,
          postRollData = data.slice(indicatorPreRoll);  // Don't show where indicators don't have data

      x.domain(techan.scale.plot.time(data).domain());
      y.domain(techan.scale.plot.ohlc(postRollData).domain());
      yPercent.domain(techan.scale.plot.percent(y, accessor(data[indicatorPreRoll])).domain());
      yVolume.domain(techan.scale.plot.volume(postRollData).domain());

      x.zoomable().domain([indicatorPreRoll, data.length]); // Zoom in a little to hide indicator preroll
      resize(selection);

      svg.select("g.candlestick").datum(data).call(candlestick);
      svg.select("g.closeValue.annotation").datum([data[data.length-1]]).call(closeAnnotation);
      svg.select("g.volume").datum(data).call(volume);
      svg.select("g.sma.ma-0").datum(techan.indicator.sma().period(10)(data)).call(sma0);
      svg.select("g.sma.ma-1").datum(techan.indicator.sma().period(20)(data)).call(sma1);
      svg.select("g.ema.ma-2").datum(techan.indicator.ema().period(50)(data)).call(ema2);

      svg.select("g.crosshair.ohlc").call(ohlcCrosshair);

      svg.append('text')
        .attr("class", "symbol")
        .attr("x", 5)
        .attr("y", 15)
        .attr("class", "shadow")
        .text(stock.name);

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
      dim.indicator.height = dim.plot.height * 0.144444;
      dim.indicator.padding = dim.plot.height * 0.01111111111;
      dim.indicator.top = dim.ohlc.height + dim.indicator.padding;
      dim.indicator.bottom = dim.indicator.top + dim.indicator.height + dim.indicator.padding;

      var xRange = [0, dim.plot.width],
          yRange = [dim.ohlc.height, 0],
          ohlcVerticalTicks = Math.min(10, Math.round(dim.height/70)),
          xTicks = Math.min(10, Math.round(dim.width/130));

      indicatorTop.range([dim.indicator.top, dim.indicator.bottom]);
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
          .attr("x", dim.width-5)
          .attr("y", dim.height);

      selection.selectAll("defs #ohlcClip > rect")
        .attr("width", dim.plot.width)
        .attr("height", dim.ohlc.height);

      selection.selectAll("defs #volumeClip > rect")
        .attr("width", dim.plot.width)
        .attr("height", dim.plot.height);

      selection.selectAll("defs .indicatorClip > rect")
        .attr("y", function (d, i) {
          return indicatorTop(i);
        })
        .attr("width", dim.plot.width)
        .attr("height", dim.indicator.height);

      selection.select("g.x.axis.bottom")
        .attr("transform", "translate(0," + dim.plot.height + ")");

      selection.select("g.ohlc g.y.axis")
        .attr("transform", "translate(" + xRange[1] + ",0)");

      selection.selectAll("g.indicator g.axis.right")
        .attr("transform", "translate(" + xRange[1] + ",0)");
      selection.selectAll("g.indicator g.axis.left")
        .attr("transform", "translate(" + xRange[0] + ",0)");
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

  return BigChart(techanSite.data.array[0]);
}(d3, techan));
