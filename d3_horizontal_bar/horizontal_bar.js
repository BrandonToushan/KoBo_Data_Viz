//setting dimensions and margins
var margin = {top: 10, right: 30, bottom: 30, left: 60},
width = 500 - margin.left - margin.right,
height = 300 - margin.top - margin.bottom;

//appending svg object to body
var svg = d3.select("#horizontal_bar_chart")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//setting background color (ggplot2 styling)
svg
.append("rect")
.attr("x",0)
.attr("y",0)
.attr("height", height)
.attr("width", width + 10)
.style("fill", "#EBEBEB")

//reading the data (.csv)
var dataset = d3.csv("https://raw.githubusercontent.com/BrandonToushan/Datasets/master/XYZ.csv",function(error,data){
  if (error) {
    throw error;
  }

//defining linear scale for x axis
var xScale = d3.scaleLinear().range([0, width]);

//defining discrete band scale for y axis
var yScale = d3.scaleBand().range([height, 0]).padding(0.25)

//providing domain values to x and y scales
xScale.domain([0, d3.max(data, function(d) { return d.value; })]);
yScale.domain(data.map(function(d){ return d.class; }));

//adding x axis
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(xScale).tickSize(-height*1.3).ticks())
  .select('.domain').remove();

//adding y axis
svg.append("g")
  .call(d3.axisLeft(yScale).tickSize(-width*1.3).ticks())
  .select('.domain').remove();

//plotting background customization (ggplot2 styling)
svg.selectAll('.tick line').attr('stroke','white')

//defining tooltip
var Tooltip = d3.select("#horizontal_bar_chart")
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
    Tooltip.
    style("opacity",0)
    d3.select(this)
      .style("fill", "#2095f4")
      .style("opacity", 1)
  }

//adding bars
  svg.selectAll('.bar')
  .data(data)
  .enter().append('rect')
  .style("fill","#2095f4")
  .on('mouseover',mouseover) //listener for mouseover event
  .on("mousemove",mousemove) //listener for mousemove event
  .on('mouseout',mouseout) //listener for mouseout event
  .attr('width',function(d) {return xScale(d.value); })
  .attr('y', function(d) { return yScale(d.class); })
  .attr('height', yScale.bandwidth());
  })
