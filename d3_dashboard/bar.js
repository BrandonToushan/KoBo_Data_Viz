//setting dimensions and margins
var margin_bar = {top: 10, right: 30, bottom: 30, left: 60},
width_bar = 500 - margin_bar.left - margin_bar.right,
height_bar = 300 - margin_bar.top - margin_bar.bottom;

//appending svg object to body
var svg_bar = d3.select("#bar_chart")
.append("svg")
.attr("width", width_bar + margin_bar.left + margin_bar.right)
.attr("height", height_bar + margin_bar.top + margin_bar.bottom)
.append("g")
.attr("transform", "translate(" + margin_bar.left + "," + margin_bar.top + ")");

//setting background color (ggplot2 styling)
svg_bar
.append("rect")
.attr("x",0)
.attr("y",0)
.attr("height", height_bar)
.attr("width", width_bar + 10)
.style("fill", "#EBEBEB")

//reading the data (.csv)
var dataset_bar = d3.csv("https://raw.githubusercontent.com/BrandonToushan/Datasets/master/XYZ.csv",function(error,data){
  if (error) {
    throw error;
  }

//defining discrete band scale for x axis
var xScale = d3.scaleBand().range([0, width_bar]).padding(0.25)

//defining linear scale for y axis
var yScale = d3.scaleLinear().range([height_bar, 0]);

//providing domain values to x and y scales
xScale.domain(data.map(function(d){ return d.class; }));
yScale.domain([0, d3.max(data,function(d) { return d.value; })]);

//adding x axis
svg_bar.append("g")
  .attr("transform", "translate(0," + height_bar + ")")
  .call(d3.axisBottom(xScale).tickSize(-height_bar*1.3).ticks())
  .select('.domain').remove();

//adding y axis
svg_bar.append("g")
  .call(d3.axisLeft(yScale).tickSize(-width_bar*1.3).ticks())
  .select('.domain').remove();

//plotting background customization (ggplot2 styling)
svg_bar.selectAll('.tick line').attr('stroke','white')

//defining tooltip
var Tooltip = d3.select("#bar_chart")
.append('div')
.style("opacity", 0.9)
.attr("class", "tooltip")
.style("background-color", '#EBEBEB')
.style("border", "solid")
.style("border-width", "1px")
.style("border-radius", "2px")
.style("padding", "2px")
.style("position", "absolute")

//defining mouseover, mousemove and mouseout functions
  var mouseover = function(d) {
    Tooltip.
    style("opacity",1)
    d3.select(this)
      .style("fill", "#414453")
      .style("opacity", 1)
  }
  var mousemove = function(d) {
    Tooltip
      .html(d.value)
      .style("left", (d3.mouse(this)[0]+70) + "px")
      .style("top", (d3.mouse(this)[1]) + "px")
  }
  var mouseout = function(d) {
    Tooltip
    .style("opacity",0)
    d3.select(this)
      .style("fill", '#479FF6')
      .style("opacity", 1)
  }

//adding bars
  svg_bar.selectAll('.bar')
  .data(data)
  .enter().append('rect')
  .style("fill",'#479FF6')
  .on('mouseover',mouseover) //listener for mouseover event
  .on("mousemove",mousemove) //listener for mousemove event
  .on('mouseout',mouseout) //listener for mouseout event
  .attr('x', function(d) { return xScale(d.class); })
  .attr('y', function(d) { return yScale(d.value); })
  .attr('width',xScale.bandwidth())
  .attr('height', function(d) { return height_bar - yScale(d.value); });
  })
