//setting dimensions and margins
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 500 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

//appending the svg object to body
var svg = d3.select("#scatter_chart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//setting background color (ggplot2 styling)
    svg
    .append("rect")
    .attr("x",0)
    .attr("y",0)
    .attr("height", height)
    .attr("width", width + 10)
    .style("fill", "#EBEBEB")

//reading the data (.csv)
d3.csv("https://raw.githubusercontent.com/BrandonToushan/Datasets/master/iris.csv", function(data) {

  //extracting groups
  var groups = d3.map(data, function(d){return(d.class)}).keys()

  //defining color palette (KoBo default)
  var colors = ["#5e88d3","#fd6f96","#fbdd83","#8eeb55","#73d6ff","#fecb72","#7197f6","#56ecc7"]

  //defining color scale
  var color = d3.scaleOrdinal()
    .domain(groups)
    .range(colors)

  //defining linear scale for x axis
  var xScale = d3.scaleLinear().range([ 0, width ])

  //defining linear scale for y axis
  var yScale = d3.scaleLinear().range([ height, 0])

  //providing domain values to x & y scales
  xScale.domain(d3.extent(data, function (d) {
      return d.val;
  }));

  yScale.domain([0, d3.max(data, function (d) {
      return d.val2;
  })]);

  //appending x axis to svg
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale).tickSize(-height*1.3).ticks(8))
    .select('.domain').remove();

  //appending y axis to svg
  svg.append("g")
    .call(d3.axisLeft(yScale).tickSize(-width*1.3).ticks(6))
    .select('.domain').remove();

  //customizing plot background (ggplot2 styling)
  svg.selectAll('.tick line').attr('stroke','white')

  //defining tooltip
  var Tooltip = d3.select("#scatter_chart")
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
    selected_group = d.class
    d3.selectAll(".dot")
    .style("fill", "#414453")
    d3.selectAll('.' + selected_group)
    .style("fill", color(selected_group))
    .attr("r", 6)}

  var mousemove = function(d) {
      Tooltip
      .html(d.class + "</br>" + d.val2)
      .style("left", (d3.mouse(this)[0]+70) + "px")
      .style("top", (d3.mouse(this)[1]) + "px")
      d3.select(this)
      .attr("r", 7.5)
    }

    var mouseout = function(d) {
      Tooltip.
      style("opacity",0)
      d3.selectAll(".dot")
      .attr("r", 5)
      .style("fill", function (d) { return color(d.class) })
      }

  //adding dots
  var path = svg.selectAll("dot")
    .data(data)
    .enter().append("circle")
      .attr("class", function (d) { return "dot " + d.class } )
      .attr("cx", function (d) { return xScale(d.val); } )
      .attr("cy", function (d) { return yScale(d.val2); } )
      .attr("r", 5)
      .style("fill", function (d) { return color(d.class) } )
    .on("mouseover", mouseover) //listener for mouseover event
    .on("mousemove", mousemove) //listener for mousemove event
    .on("mouseout", mouseout) //listener for mouseout event
})
