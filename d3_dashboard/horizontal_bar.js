//setting dimensions and margins
var margin_horizontal_bar = {top: 10, right: 30, bottom: 30, left: 60},
width_horizontal_bar = 500 - margin_horizontal_bar.left - margin_horizontal_bar.right,
height_horizontal_bar = 300 - margin_horizontal_bar.top - margin_horizontal_bar.bottom;

//appending svg object to body
var svg_horizontal_bar = d3.select("#horizontal_bar_chart")
.append("svg")
.attr("width", width_horizontal_bar + margin_horizontal_bar.left + margin_horizontal_bar.right)
.attr("height", height_horizontal_bar + margin_horizontal_bar.top + margin_horizontal_bar.bottom)
.append("g")
.attr("transform", "translate(" + margin_horizontal_bar.left + "," + margin_horizontal_bar.top + ")");

//setting background color (ggplot2 styling)
svg_horizontal_bar
.append("rect")
.attr("x",0)
.attr("y",0)
.attr("height", height_horizontal_bar)
.attr("width", width_horizontal_bar + 10)
.style("fill", "#EBEBEB")

//reading the data (.csv)
var dataset_horizontal_bar = d3.csv("https://raw.githubusercontent.com/BrandonToushan/Datasets/master/XYZ.csv",function(error,data){
  if (error) {
    throw error;
  }

//defining linear scale for x axis
var xScale = d3.scaleLinear().range([0, width_horizontal_bar]);

//defining discrete band scale for y axis
var yScale = d3.scaleBand().range([height_horizontal_bar, 0]).padding(0.25)

//providing domain values to x and y scales
xScale.domain([0, d3.max(data, function(d) { return d.value; })]);
yScale.domain(data.map(function(d){ return d.class; }));

//adding x axis
svg_horizontal_bar.append("g")
  .attr("transform", "translate(0," + height_horizontal_bar + ")")
  .call(d3.axisBottom(xScale).tickSize(-height_horizontal_bar*1.3).ticks())
  .select('.domain').remove();

//adding y axis
svg_horizontal_bar.append("g")
  .call(d3.axisLeft(yScale).tickSize(-width_horizontal_bar*1.3).ticks())
  .select('.domain').remove();

//plotting background customization (ggplot2 styling)
svg_horizontal_bar.selectAll('.tick line').attr('stroke','white')

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
      .style("fill", '#479FF6')
      .style("opacity", 1)
  }

//adding bars
  svg_horizontal_bar.selectAll('.bar')
  .data(data)
  .enter().append('rect')
  .style("fill","#479FF6")
  .on('mouseover',mouseover) //listener for mouseover event
  .on("mousemove",mousemove) //listener for mousemove event
  .on('mouseout',mouseout) //listener for mouseout event
  .attr('width',function(d) {return xScale(d.value); })
  .attr('y', function(d) { return yScale(d.class); })
  .attr('height', yScale.bandwidth());
  })
